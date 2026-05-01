import { NotFoundError, ValidationError } from "@packages/error-handler";
import prisma from "@packages/libs/prisma";
import redis from "@packages/libs/redis";
import { NextFunction, Request, Response } from "express";
import { Prisma } from "generated/prisma";
import Stripe from "stripe";
import { sendEmail } from "../utils/send-email";
import { sendLog } from "@packages/utils/logs/send-logs";


// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//     apiVersion: "2025-07-30.basil",
// });

const stripe = new Stripe("sk_test_51RxYbqAb77vizp1xMTKNva72q2Q6QRqB9NECG5wHZybPY57nBVgbDv8tuhxfjMpEFgd6WvNCMDmxkgxJJXALYeb900SWYfzEJS", {
    // @ts-ignore
    apiVersion: "2025-07-30.basil",
});
// create payment intent
export const createPaymentIntent = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    const { amount, sellerStripeAccountId, sessionId } = req.body;

    const customerAmount = Math.round(amount * 100);
    const platformFee = Math.floor(customerAmount * 0.1);

    console.log("Seller Stripe ID", sellerStripeAccountId);

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: customerAmount,
            currency: "usd",
            payment_method_types: ["card"],
            application_fee_amount: platformFee,
            transfer_data: {
                // destination: "acct_1S7ex0PRvQdijfZr", // sellerStripeAccountId
                destination: sellerStripeAccountId,
            },
            metadata: {
                sessionId,
                userId: req.user.id
            }
        });
        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        next(error);
    }
};

// create payment session
export const createPaymentSession = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const { cart, selectedAddressId, coupon } = req.body;
        const userId = req.user.id;

        if (!cart || !Array.isArray(cart) || cart.length === 0) {
            return next(new ValidationError("Cart is empty or invalid."));
        }

        const normalizedCart = JSON.stringify(
            cart.map((item: any) => ({
                id: item.id,
                quantity: item.quantity,
                sale_price: item.sale_price,
                shopId: item.shopId,
                selectedOptions: item.selectedOptions || {},
            }))
                .sort((a, b) => a.id.localeCompare(b.id))
        );

        const keys = await redis.keys("payment-session:*");
        for (const key of keys) {
            const data = await redis.get(key);
            if (data) {
                const session = JSON.parse(data);
                if (session.userId === userId) {
                    const existingCart = JSON.stringify(
                        session.cart
                            .map((item: any) => ({
                                id: item.id,
                                quantity: item.quantity,
                                sale_price: item.sale_price,
                                shopId: item.shopId,
                                selectedOptions: item.selectedOptions || {},
                            }))
                            .sort((a: any, b: any) => a.id.localeCompare(b.id))
                    );

                    if (existingCart === normalizedCart) {
                        return res.status(200).json({ sessionId: key.split(":")[1] });
                    } else {
                        await redis.del(key);
                    }
                }
            }
        }

        // fetch sellers and their stripe accounts
        const uniqueShopIds = [...new Set(cart.map((item: any) => item.shopId))];

        const shops = await prisma.shops.findMany({
            where: {
                id: { in: uniqueShopIds },
            },
            select: {
                id: true,
                sellerId: true,
                seller: {
                    select: {
                        stripeId: true,
                    },
                },
            },
        });

        const sellerData = shops.map((shop) => ({
            shopId: shop.id,
            sellerId: shop.sellerId,
            stripeAccountId: shop?.seller?.stripeId,
        }));

        // calculate total
        const totalAmount = cart.reduce((total: number, item: any) => {
            return total + item.quantity * item.sale_price;
        }, 0);

        // create session payload
        const sessionId = crypto.randomUUID();

        const sessionData = {
            userId,
            cart,
            sellers: sellerData,
            totalAmount,
            shippingAddressId: selectedAddressId || null,
            coupon: coupon || null,
        };

        await redis.setex(
            `payment-session:${sessionId}`,
            600, // 10 minutes
            JSON.stringify(sessionData)
        );

        return res.status(201).json({ sessionId });
    } catch (error) {
        next(error);
    }
};

// verifying payment session
export const verifyingPaymentSession = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const sessionId = req.query.sessionId as string;
        if (!sessionId) {
            return res.status(400).json({ error: "Session ID is required." });
        }

        // Fetch session from Redis
        const sessionKey = `payment-session:${sessionId}`;
        const sessionData = await redis.get(sessionKey);

        if (!sessionData) {
            return res.status(404).json({ error: "Session not found or expired." });
        }

        // Parse and return session
        const session = JSON.parse(sessionData);

        return res.status(200).json({
            success: true,
            session,
        });
    } catch (error) {
        return next(error);
    }
};

// create order
export const createOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const stripeSignature = req.headers["stripe-signature"];
        if (!stripeSignature) {
            return res.status(400).send("Missing Stripe signature");
        }

        const rawBody = (req as any).rawBody;

        let event;

        try {
            event = stripe.webhooks.constructEvent(
                rawBody,
                stripeSignature,
                // process.env.STRIPE_WEBHOOK_SECRET!
                "whsec_4c8e01136b672dc55ccc412773716e1810f539b64776cc495d0052ff457640db"
            );
        } catch (err: any) {
            console.error("Webhook signature verification failed.", err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        if (event.type === "payment_intent.succeeded") {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            const sessionId = paymentIntent.metadata.sessionId;
            const userId = paymentIntent.metadata.userId;

            const sessionKey = `payment-session:${sessionId}`;
            const sessionData = await redis.get(sessionKey);

            if (!sessionData) {
                console.warn("Session data expired or missing for", sessionId);
                return res
                    .status(200)
                    .send("No session found, skipping order creation");
            }

            const { cart, totalAmount, shippingAddressId, coupon } =
                JSON.parse(sessionData);

            const user = await prisma.users.findUnique({ where: { id: userId } });
            const name = user?.name!;
            const email = user?.email!;

            const shopGrouped = cart.reduce((acc: any, item: any) => {
                if (!acc[item.shopId]) acc[item.shopId] = [];
                acc[item.shopId].push(item);
                return acc;
            }, {});

            for (const shopId in shopGrouped) {
                const orderItems = shopGrouped[shopId];

                let orderTotal = orderItems.reduce(
                    (sum: number, p: any) => sum + p.quantity * p.sale_price,
                    0
                );
                // Apply discount if applicable
                if (
                    coupon &&
                    coupon.discountedProductId &&
                    orderItems.some((item: any) => item.id === coupon.discountedProductId)
                ) {
                    const discountedItem = orderItems.find(
                        (item: any) => item.id === coupon.discountedProductId
                    );
                    if (discountedItem) {
                        const discount =
                            coupon.discountPercent > 0
                                ? (discountedItem.sale_price *
                                    discountedItem.quantity *
                                    coupon.discountPercent) /
                                100
                                : coupon.discountAmount;

                        orderTotal -= discount;
                    }
                }

                // Create order
                const order = await prisma.orders.create({
                    data: {
                        userId,
                        shopId,
                        total: orderTotal,
                        status: "Paid",
                        shippingAddressId: shippingAddressId || null,
                        couponCode: coupon?.code || null,
                        discountAmount: coupon?.discountAmount || 0,
                        items: {
                            create: orderItems.map((item: any) => ({
                                productId: item.id,
                                quantity: item.quantity,
                                price: item.sale_price,
                                selectedOptions: item.selectedOptions,
                            })),
                        },
                    },
                });

                // Update product & analytics
                for (const item of orderItems) {
                    const { id: productId, quantity } = item;

                    await prisma.products.update({
                        where: { id: productId },
                        data: {
                            stock: { decrement: quantity },
                            totalSales: { increment: quantity },
                        },
                    });

                    await prisma.productAnalytics.upsert({
                        where: { productId },
                        create: {
                            productId,
                            shopId,
                            purchases: quantity,
                            lastViewedAt: new Date(),
                        },
                        update: {
                            purchases: { increment: quantity },
                        }
                    });

                    const existingAnalytics = await prisma.userAnalytics.findUnique({
                        where: { userId },
                    });

                    const newAction = {
                        productId,
                        shopId,
                        action: "purchase",
                        timestamp: Date.now(),
                    };

                    const currentActions = Array.isArray(existingAnalytics?.actions)
                        ? (existingAnalytics.actions as Prisma.JsonArray)
                        : [];

                    if (existingAnalytics) {
                        await prisma.userAnalytics.update({
                            where: { userId },
                            data: {
                                lastVisited: new Date(),
                                actions: [...currentActions, newAction],
                            },
                        });
                    } else {
                        await prisma.userAnalytics.create({
                            data: {
                                userId,
                                lastVisited: new Date(),
                                actions: [newAction],
                            },
                        });
                    }
                }

                // Send email for user
                await sendEmail(
                    email,
                    "🛍️ Your Eshop Order Confirmation",
                    "order-confirmation",
                    {
                        name,
                        cart,
                        totalAmount: coupon?.discountAmount
                            ? totalAmount - coupon?.discountAmount
                            : totalAmount,
                        trackingUrl: `/order/${order.id}`,
                    }
                );

                // Create notifications for sellers
                const createdShopIds = Object.keys(shopGrouped);
                const sellerShops = await prisma.shops.findMany({
                    where: { id: { in: createdShopIds } },
                    select: {
                        id: true,
                        sellerId: true,
                        name: true,
                    },
                });

                for (const shop of sellerShops) {
                    const firstProduct = shopGrouped[shop.id][0];
                    const productTitle = firstProduct?.title || "new item";

                    await prisma.notifications.create({
                        data: {
                            title: "🛒 New Order Received",
                            message: `A customer just ordered ${productTitle} from your shop.`,
                            creatorId: userId,
                            receiverId: shop.sellerId,
                            redirect_link: `https://eshop.com/order/${sessionId}`,
                        },
                    });
                }

                // Create notification for admin
                await prisma.notifications.create({
                    data: {
                        title: "📦 Platform Order Alert",
                        message: `A new order was placed by ${name}.`,
                        creatorId: userId,
                        receiverId: "admin",
                        redirect_link: `https://eshop.com/order/${sessionId}`,
                    },
                });

                await redis.del(sessionKey);
            }
        }
        res.status(200).json({ received: true });
    } catch (error) {
        console.log(error);
        return next(error);
    }
};

// Create COD Order (No Stripe, Direct Order)
export const createCODOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { cart, selectedAddressId, coupon } = req.body;
        // @ts-ignore
        const userId = req.user?.id; // assuming auth middleware injects user

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!cart || cart.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // Find user info
        const user = await prisma.users.findUnique({ where: { id: userId } });
        const name = user?.name!;
        const email = user?.email!;

        // Group products by shop
        const shopGrouped = cart.reduce((acc: any, item: any) => {
            if (!acc[item.shopId]) acc[item.shopId] = [];
            acc[item.shopId].push(item);
            return acc;
        }, {});

        let createdOrders: any[] = [];

        for (const shopId in shopGrouped) {
            const orderItems = shopGrouped[shopId];

            // Calculate total
            let orderTotal = orderItems.reduce(
                (sum: number, p: any) => sum + p.quantity * p.sale_price,
                0
            );

            // Apply discount if applicable
            if (
                coupon &&
                coupon.discountedProductId &&
                orderItems.some((item: any) => item.id === coupon.discountedProductId)
            ) {
                const discountedItem = orderItems.find(
                    (item: any) => item.id === coupon.discountedProductId
                );

                if (discountedItem) {
                    const discount =
                        coupon.discountPercent > 0
                            ? (discountedItem.sale_price *
                                discountedItem.quantity *
                                coupon.discountPercent) /
                            100
                            : coupon.discountAmount;

                    orderTotal -= discount;
                }
            }

            // Create ORDER → COD status set as "Pending" or "Placed"
            const order = await prisma.orders.create({
                data: {
                    userId,
                    shopId,
                    total: orderTotal,
                    status: "Pending", // COD orders are pending
                    // paymentMethod: "COD",
                    shippingAddressId: selectedAddressId || null,
                    couponCode: coupon?.code || null,
                    discountAmount: coupon?.discountAmount || 0,
                    items: {
                        create: orderItems.map((item: any) => ({
                            productId: item.id,
                            quantity: item.quantity,
                            price: item.sale_price,
                            selectedOptions: item.selectedOptions,
                        })),
                    },
                },
            });

            createdOrders.push(order);

            // Update stock & analytics
            for (const item of orderItems) {
                const { id: productId, quantity } = item;

                await prisma.products.update({
                    where: { id: productId },
                    data: {
                        stock: { decrement: quantity },
                        totalSales: { increment: quantity },
                    },
                });

                // Product analytics
                await prisma.productAnalytics.upsert({
                    where: { productId },
                    create: {
                        productId,
                        shopId,
                        purchases: quantity,
                        lastViewedAt: new Date(),
                    },
                    update: {
                        purchases: { increment: quantity },
                    },
                });

                // User analytics
                const existingAnalytics = await prisma.userAnalytics.findUnique({
                    where: { userId },
                });

                const newAction = {
                    productId,
                    shopId,
                    action: "purchase",
                    timestamp: Date.now(),
                };

                const currentActions = Array.isArray(existingAnalytics?.actions)
                    ? existingAnalytics.actions
                    : [];

                if (existingAnalytics) {
                    await prisma.userAnalytics.update({
                        where: { userId },
                        data: {
                            lastVisited: new Date(),
                            actions: [...currentActions, newAction],
                        },
                    });
                } else {
                    await prisma.userAnalytics.create({
                        data: {
                            userId,
                            lastVisited: new Date(),
                            actions: [newAction],
                        },
                    });
                }
            }

            // Send email
            await sendEmail(
                email,
                "🛍️ Your COD Order Confirmation",
                "order-confirmation",
                {
                    name,
                    cart,
                    totalAmount: orderTotal,
                    trackingUrl: `/order/${order.id}`,
                }
            );

            // Notify seller
            const firstProduct = orderItems[0];
            await prisma.notifications.create({
                data: {
                    title: "🛒 New COD Order Received",
                    message: `A customer ordered ${firstProduct?.title || "an item"} from your shop.`,
                    creatorId: userId,
                    receiverId: firstProduct.sellerId,
                    redirect_link: `https://eshop.com/order/${order.id}`,
                },
            });
        }

        // Admin notification
        await prisma.notifications.create({
            data: {
                title: "📦 New COD Order",
                message: `${name} placed a cash-on-delivery order.`,
                creatorId: userId,
                receiverId: "admin",
                redirect_link: `/admin/orders`,
            },
        });

        return res.status(201).json({
            message: "COD Order placed successfully!",
            orders: createdOrders,
        });
    } catch (error) {
        return next(error);
    }
};

// get sellers orders
export const getSellerOrders = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const shop = await prisma.shops.findUnique({
            where: {
                sellerId: req.seller.id,
            },
        });

        // fetch all orders for this shop
        const orders = await prisma.orders.findMany({
            where: {
                shopId: shop?.id,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        res.status(201).json({
            success: true,
            orders,
        });
    } catch (error) {
        next(error);
    }
};


// get order details
export const getOrderDetails = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const orderId = req.params.id;

        const order = await prisma.orders.findUnique({
            where: {
                id: orderId,
            },
            include: {
                items: true,
            },
        });

        if (!order) {
            return next(new NotFoundError("Order not found with the id!"));
        }

        const shippingAddress = order.shippingAddressId
            ? await prisma.address.findUnique({
                where: {
                    id: order?.shippingAddressId
                },
            })
            : null;

        const coupon = order.couponCode
            ? await prisma?.discount_codes.findUnique({
                where: {
                    discountCode: order.couponCode,
                },
            })
            : null;

        // fetch all products details in one go
        const productIds = order.items.map((item) => item.productId);

        const products = await prisma.products.findMany({
            where: {
                id: { in: productIds },
            },
            select: {
                id: true,
                title: true,
                images: true,
            },
        });

        const productMap = new Map(products.map((p) => [p.id, p]));

        const items = order.items.map((item) => ({
            ...item,
            selectedOptions: item.selectedOptions,
            product: productMap.get(item.productId) || null,
        }));

        res.status(200).json({
            success: true,
            order: {
                ...order,
                items,
                shippingAddress,
                couponCode: coupon,
            },
        });

    } catch (error) {
        next(error);
    }
};


// verify coupon code
export const verifyCouponCode = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { couponCode, cart } = req.body;

        if (!couponCode || !cart || cart.length === 0) {
            return next(new ValidationError("Coupon code and cart are required!"));
        }

        // Fetch the discount code
        const discount = await prisma.discount_codes.findUnique({
            where: { discountCode: couponCode },
        });

        if (!discount) {
            return next(new ValidationError("Coupon code isn't valid!"));
        }

        // Find matching product that includes this discount code
        const matchingProduct = cart.find((item: any) =>
            item.discount_codes?.some((d: any) => d === discount.id)
        );

        if (!matchingProduct) {
            return res.status(200).json({
                valid: false,
                discount: 0,
                discountAmount: 0,
                message: "No matching product found in cart for this coupon",
            });
        }

        let discountAmount = 0;
        const price = matchingProduct.sale_price * matchingProduct.quantity;

        if (discount.discountType === "percentage") {
            discountAmount = (price * discount.discountValue) / 100;
        } else if (discount.discountType === "flat") {
            discountAmount = discount.discountValue;
        }

        // Prevent discount from being greater than total price
        discountAmount = Math.min(discountAmount, price);

        res.status(200).json({
            valid: true,
            discount: discount.discountValue,
            discountAmount: discountAmount.toFixed(2),
            discountedProductId: matchingProduct.id,
            discountType: discount.discountType,
            message: "Discount applied to 1 eligible product",
        });

    } catch (error) {
        next(error);
    }
}

// get user orders
export const getUserOrders = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        await sendLog({
            type: "success",
            message: `User orders retrieved ${req.user?.email}`,
            source: "order-service",
        });

        const orders = await prisma.orders.findMany({
            where: {
                userId: req.user.id,
            },
            include: {
                items: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        res.status(201).json({
            success: true,
            orders,
        });
    } catch (error) {
        return next(error);
    }
};

// get admin orders
export const getAdminOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Fetch all orders
        const orders = await prisma.orders.findMany({
            include: {
                user: true,
                shop: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.status(200).json({
            success: true,
            orders,
        });

    } catch (error) {
        next(error);
    }
};


const validStatuses = [
    "PROCESSING",
    "SHIPPED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
];

export const updateOrderStatus = async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const { deliveryStatus } = req.body;

    try {
        // ✅ Validate ENUM value
        if (!validStatuses.includes(deliveryStatus)) {
            return res.status(400).json({
                message: "Invalid delivery status",
            });
        }

        // ✅ Update order
        const updatedOrder = await prisma.orders.update({
            where: { id: orderId },
            data: {
                deliveryStatus,
            },
        });

        return res.status(200).json({
            message: "Delivery status updated successfully",
            order: updatedOrder,
        });

    } catch (error) {
        console.error("Error updating order status:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};