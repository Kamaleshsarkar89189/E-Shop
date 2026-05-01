// "use client";

// import React, { useEffect, useState } from "react";
// import { Loader2 } from "lucide-react";
// import { useParams, useRouter } from "next/navigation";
// import axiosInstance from "apps/admin-ui/src/utils/axiosInstance";


// const Page = () => {
//     const params = useParams();
//     const orderId = params.id as string;

//     const [order, setOrder] = useState<any>(null);
//     const [loading, setLoading] = useState(true);

//     const router = useRouter();

//     useEffect(() => {
//         const fetchOrder = async () => {
//             try {
//                 const res = await axiosInstance.get(
//                     `/order/api/get-order-details/${orderId}`
//                 );
//                 setOrder(res.data.order);
//             } catch (err) {
//                 console.error("Failed to fetch order details", err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (orderId) fetchOrder();
//     }, [orderId]);

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-[40vh]">
//                 <Loader2 className="animate-spin w-6 h-6 text-gray-200" />
//             </div>
//         );
//     }

//     if (!order) {
//         return <p className="text-center text-sm text-red-500">Order not found.</p>;
//     }

//     return (
//         <div className="max-w-5xl mx-auto px-4 py-10">
//             {/* ✅ Back Button */}
//             <button
//                 onClick={() => router.back()}
//                 className="mb-4 flex items-center gap-2 text-sm text-blue-400 hover:text-blue-500"
//             >
//                 ← Back
//             </button>
//             <h1 className="text-2xl font-bold text-gray-200 mb-4">
//                 Order #{order.id.slice(-6)}
//             </h1>

//             {/* Delivery Progress Bar */}
//             <div className="my-4">
//                 <div className="flex items-center justify-between text-xs font-medium text-g">
//                     {[
//                         "Ordered",
//                         "Packed",
//                         "Shipped",
//                         "Out for Delivery",
//                         "Delivered",
//                     ].map((step, idx) => {
//                         const current = step.toLowerCase() ===
//                             (order.deliveryStatus || "processing").toLowerCase();
//                         const passed =
//                             idx <=
//                             [
//                                 "Ordered",
//                                 "Packed",
//                                 "Shipped",
//                                 "Out for Delivery",
//                                 "Delivered",
//                             ].findIndex(
//                                 (s) =>
//                                     s.toLowerCase() ===
//                                     (order.deliveryStatus || "processing").toLowerCase()
//                             );
//                         return (
//                             <div
//                                 key={step}
//                                 className={`flex-1 text-left ${current
//                                     ? "text-blue-600"
//                                     : passed
//                                         ? "text-green-600"
//                                         : "text-gray-200"
//                                     }`}
//                             >
//                                 {step}
//                             </div>
//                         );
//                     })}
//                 </div>
//                 <div className="flex items-center">
//                     {[
//                         "Ordered",
//                         "Packed", -
//                         "Shipped",
//                         "Out for Delivery",
//                         "Delivered",
//                     ].map((step, idx) => {
//                         const isReached =
//                             idx <=
//                             [
//                                 "Ordered",
//                                 "Packed",
//                                 "Shipped",
//                                 "Out for Delivery",
//                                 "Delivered",
//                             ].findIndex(
//                                 (s) =>
//                                     (order.deliveryStatus || "processing").toLowerCase()
//                             );

//                         return (
//                             <div key={step} className="flex-1 flex items-center">
//                                 <div
//                                     className={`w-4 h-4 rounded-full ${isReached ? "bg-blue-600" : "bg-gray-300"
//                                         }`}
//                                 />
//                                 {idx !== 4 && (
//                                     <div
//                                         className={`flex-1 h-1 ${isReached ? "bg-blue-500" : "bg-gray-200"
//                                             }`}
//                                     />
//                                 )}
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>

//             {/* Summary Info */}
//             <div className="mb-6 space-y-1 text-sm text-gray-200">
//                 <p>
//                     <span className="font-semibold">Payment Status:</span>{" "}
//                     <span className="text-green-600 font-medium">{order.status}</span>
//                 </p>
//                 <p>
//                     <span className="font-semibold">Total Paid:</span>{" "}
//                     <span className="font-medium">${order.total.toFixed(2)}</span>
//                 </p>

//                 {order.discountAmount > 0 && (
//                     <p>
//                         <span className="font-semibold">Discount Applied:</span>{" "}
//                         <span className="text-green-400">
//                             -${order.discountAmount.toFixed(2)} (
//                             {order.couponCode?.discountType === "percentage"
//                                 ? `${order.couponCode.discountValue}%`
//                                 : `$${order.couponCode.discountValue}`}
//                             {" "}
//                             off)
//                         </span>
//                     </p>
//                 )}

//                 {order.couponCode && (
//                     <p>
//                         <span className="font-semibold">Coupon Used:</span>{" "}
//                         <span className="text-blue-400">
//                             {order.couponCode.public_name}
//                         </span>
//                     </p>
//                 )}

//                 <p>
//                     <span className="font-semibold">Date:</span>{" "}
//                     {new Date(order.createdAt).toLocaleDateString()}
//                 </p>
//             </div>

//             {/* Shipping Info */}
//             {order.shippingAddress && (
//                 <div className="mb-6 text-sm text-gray-300">
//                     <h2 className="text-md font-semibold mb-2">Shipping Address</h2>
//                     <p>{order.shippingAddress.name}</p>
//                     <p>
//                         {order.shippingAddress.street}, {order.shippingAddress.city},{", "}
//                         {order.shippingAddress.zip}
//                     </p>
//                     <p>{order.shippingAddress.country}</p>
//                 </div>
//             )}

//             {/* Order Items */}
//             <div>
//                 <h2 className="text-lg font-semibold text-gray-300 mb-4">
//                     Order Items
//                 </h2>
//                 <div className="space-y-4">
//                     {order.items.map((item: any) => (
//                         <div
//                             key={item.productId}
//                             className="border border-gray-200 rounded-md p-4 flex items-center gap-"
//                         >
//                             <img
//                                 src={item.product?.images[0]?.url || "/placeholder.png"}
//                                 alt={item.product?.title || "Product image"}
//                                 className="w-16 h-16 object-cover rounded-md border border-gray-200"
//                             />
//                             <div className="flex-1">
//                                 <p className="font-medium text-gray-200">
//                                     {item.product?.title || "Unnamed Product"}
//                                 </p>
//                                 <p className="text-sm text-gray-300">
//                                     Quantity: {item.quantity}
//                                 </p>
//                                 {item.selectedOptions &&
//                                     Object.keys(item.selectedOptions).length > 0 && (
//                                         <div className="text-xs text-gray-400 mt-1">
//                                             {Object.entries(item.selectedOptions).map(
//                                                 ([key, value]: [string, any]) =>
//                                                     value && (
//                                                         <span key={key} className="mr-3">
//                                                             <span className="font-medium capitalize">
//                                                                 {key}:
//                                                             </span>{" "}
//                                                             {value}
//                                                         </span>
//                                                     )
//                                             )}
//                                         </div>
//                                     )}
//                             </div>
//                             <p className="text-sm font-semibold text-gray-200">
//                                 ${item.price.toFixed(2)}
//                             </p>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Page;


"use client";

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "apps/admin-ui/src/utils/axiosInstance";

const statuses = [
    "PROCESSING",
    "SHIPPED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
];

const statusLabels: Record<string, string> = {
    PROCESSING: "Processing",
    SHIPPED: "Shipped",
    OUT_FOR_DELIVERY: "Out for Delivery",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
};

const statusStyles: Record<string, string> = {
    PROCESSING: "text-yellow-500",
    SHIPPED: "text-blue-500",
    OUT_FOR_DELIVERY: "text-purple-500",
    DELIVERED: "text-green-500",
    CANCELLED: "text-red-500", bg: "bg-red-500",
};

const Page = () => {
    const params = useParams();
    const orderId = params.id as string;

    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await axiosInstance.get(
                    `/order/api/get-order-details/${orderId}`
                );
                setOrder(res.data.order);
            } catch (err) {
                console.error("Failed to fetch order details", err);
            } finally {
                setLoading(false);
            }
        };

        if (orderId) fetchOrder();
    }, [orderId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[40vh]">
                <Loader2 className="animate-spin w-6 h-6 text-gray-200" />
            </div>
        );
    }

    if (!order) {
        return <p className="text-center text-sm text-red-500">Order not found.</p>;
    }

    // ✅ Cancel case
    // if (order.deliveryStatus === "CANCELLED") {
    //     return (
    //         <div className="text-center py-10">
    //             <h1 className="text-xl font-bold text-red-500">
    //                 Order Cancelled ❌
    //             </h1>
    //             <button
    //                 onClick={() => router.back()}
    //                 className="mt-4 text-blue-400"
    //             >
    //                 ← Back
    //             </button>
    //         </div>
    //     );
    // }

    const currentIndex = statuses.indexOf(order.deliveryStatus);

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="mb-4 flex items-center gap-2 text-sm text-blue-400 hover:text-blue-500"
            >
                ← Back
            </button>

            <h1 className="text-2xl font-bold text-gray-200 mb-4">
                Order #{order.id.slice(-6)}
            </h1>

            {/* ✅ Current Status */}
            <p
                className={`mb-4 font-semibold ${statusStyles[order.deliveryStatus]
                    }`}
            >
                Current Status: {statusLabels[order.deliveryStatus]}
            </p>

            {/* ✅ Delivery Progress */}
            <div className="my-4">
                <div className="flex items-center justify-between text-xs font-medium mb-2">
                    {statuses.map((step, idx) => {
                        const passed = idx <= currentIndex;

                        return (
                            <div
                                key={step}
                                className={`flex-1 text-left ${passed ? statusStyles[step] : "text-gray-400"
                                    }`}
                            >
                                {statusLabels[step]}
                            </div>
                        );
                    })}
                </div>

                <div className="flex items-center">
                    {statuses.map((step, idx) => {
                        const reached = idx <= currentIndex;

                        return (
                            <div key={step} className="flex-1 flex items-center">
                                <div
                                    className={`w-4 h-4 rounded-full ${reached
                                            ? statusStyles[step].replace("text", "bg")
                                            : "bg-gray-300"
                                        }`}
                                />
                                {idx !== statuses.length - 1 && (
                                    <div
                                        className={`flex-1 h-1 ${reached
                                                ? statusStyles[step].replace("text", "bg")
                                                : "bg-gray-200"
                                            }`}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Summary */}
            <div className="mb-6 space-y-1 text-sm text-gray-200">
                <p>
                    <span className="font-semibold">Payment Status:</span>{" "}
                    <span className="text-green-600 font-medium">{order.status}</span>
                </p>

                <p>
                    <span className="font-semibold">Total Paid:</span>{" "}
                    <span className="font-medium">${order.total.toFixed(2)}</span>
                </p>

                <p>
                    <span className="font-semibold">Date:</span>{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                </p>
            </div>

            {/* Shipping */}
            {order.shippingAddress && (
                <div className="mb-6 text-sm text-gray-300">
                    <h2 className="text-md font-semibold mb-2">
                        Shipping Address
                    </h2>
                    <p>{order.shippingAddress.name}</p>
                    <p>
                        {order.shippingAddress.street},{" "}
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.zip}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                </div>
            )}

            {/* Items */}
            <div>
                <h2 className="text-lg font-semibold text-gray-300 mb-4">
                    Order Items
                </h2>

                <div className="space-y-4">
                    {order.items.map((item: any) => (
                        <div
                            key={item.productId}
                            className="border border-gray-200 rounded-md p-4 flex items-center gap-4"
                        >
                            <img
                                src={
                                    item.product?.images[0]?.url || "/placeholder.png"
                                }
                                alt={item.product?.title || "Product image"}
                                className="w-16 h-16 object-cover rounded-md border border-gray-200"
                            />

                            <div className="flex-1">
                                <p className="font-medium text-gray-200">
                                    {item.product?.title || "Unnamed Product"}
                                </p>

                                <p className="text-sm text-gray-300">
                                    Quantity: {item.quantity}
                                </p>
                            </div>

                            <p className="text-sm font-semibold text-gray-200">
                                ${item.price.toFixed(2)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Page;