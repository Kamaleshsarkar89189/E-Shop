import { ValidationError } from "@packages/error-handler";
import { imagekit } from "@packages/libs/imagekit";
import prisma from "@packages/libs/prisma";
import { NextFunction, Request, Response } from "express";

// get all products
export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;

        const [products, totalProducts] = await Promise.all([
            prisma.products.findMany({
                where: {
                    starting_date: null,
                },
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    sale_price: true,
                    stock: true,
                    createdAt: true,
                    ratings: true,
                    category: true, images: {
                        select: { url: true },
                        take: 1,
                    },
                    Shop: {
                        select: { name: true },
                    },
                },
            }),
            prisma.products.count({
                where: {
                    starting_date: null,
                },
            }),
        ]);

        const totalPages = Math.ceil(totalProducts / limit);

        res.status(200).json({
            success: true,
            data: products,
            meta: {
                totalProducts,
                currentPage: page,
                totalPages,
            },
        });
    } catch (error) {
        next(error);
    }
};

// get all events
export const getAllEvents = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;

        const [events, totalEvents] = await Promise.all([
            prisma.products.findMany({
                where: {
                    starting_date: {
                        not: null,
                    },
                },
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    sale_price: true,
                    stock: true,
                    createdAt: true,
                    ratings: true,
                    category: true,
                    starting_date: true,
                    ending_date: true,
                    images: {
                        select: { url: true },
                        take: 1,
                    },
                    Shop: {
                        select: { name: true },
                    },
                },
            }),
            prisma.products.count({
                where: {
                    starting_date: {
                        not: null,
                    },
                }
            })
        ])

        const totalPages = Math.ceil(totalEvents / limit);

        res.status(200).json({
            success: true,
            data: events,
            meta: {
                totalEvents,
                currentPage: page,
                totalPages,
            },
        });
    } catch (error) {
        next(error);
    }
}

// get all admins
export const getAllAdmins = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const admins = await prisma.users.findMany({
            where: {
                role: "admin",
            },
        });

        res.status(201).json({
            success: true,
            admins,
        });
    } catch (error) {
        next(error);
    }
}

// add new admin
export const addNewAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { email, role } = req.body;

        const isUser = await prisma.users.findUnique({ where: { email } });
        if (!isUser) {
            return next(new ValidationError("Something went wrong!"));
        }

        const updateRole = await prisma.users.update({
            where: { email },
            data: {
                role,
            },
        });

        res.status(201).json({
            success: true,
            updateRole,
        });
    } catch (error) {
        next(error);
    }
};

// fetch all customizations
export const getAllCustomizations = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const config = await prisma.site_config.findFirst();

        return res.status(200).json({
            categories: config?.categories || [],
            subCategories: config?.subCategories || {},
            logo: config?.logo || null,
            banner: config?.banner || null,
        });
    } catch (error) {
        return next(error);
    }
};

// get all users
export const getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;

        const [users, totalUsers] = await Promise.all([
            prisma.users.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true,
                },
            }),
            prisma.users.count(),
        ]);

        const totalPages = Math.ceil(totalUsers / limit);

        res.status(200).json({
            success: true,
            data: users,
            meta: {
                totalUsers,
                currentPage: page,
                totalPages,
            },
        });
    } catch (error) {
        next(error);
    }
}

// get all sellers
export const getAllSellers = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;

        const [sellers, totalSellers] = await Promise.all([
            prisma.sellers.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true,
                    shop: {
                        select: {
                            name: true,
                            avatar: true,
                            address: true,
                        },
                    },
                },
            }),
            prisma.sellers.count(),
        ]);

        const totalPages = Math.ceil(totalSellers / limit);

        res.status(200).json({
            success: true,
            data: sellers,
            meta: {
                totalSellers,
                currentPage: page,
                totalPages,
            },
        });
    } catch (error) {
        next(error);
    }
}

// get all notifications
// export const getAllNotifications = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     try {
//         const notifications = await prisma.notifications.findMany({
//             where: {
//                 receiverId: "admin",
//             },
//             orderBy: {
//                 createdAt: "desc",
//             },
//         });

//         res.status(200).json({
//             success: true,
//             notifications,
//         });
//     } catch (error) {
//         next(error);
//     }
// };


export const getAllNotifications = async (req, res, next) => {
    try {
        const admin = await prisma.users.findFirst({
            where: { role: "admin" },
            select: { id: true },
        });

        const notifications = await prisma.notifications.findMany({
            where: {
                receiverId: admin?.id,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        res.status(200).json({
            success: true,
            notifications,
        });
    } catch (error) {
        next(error);
    }
};

// get all users notification
export const getUserNotifications = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const notifications = await prisma.notifications.findMany({
            where: {
                receiverId: req.user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        res.status(200).json({
            success: true,
            notifications,
        });
    } catch (error) {
        next(error);
    }
};

// fetching notifications for sellers
export const sellerNotifications = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const sellerId = req.seller.id;

        const notifications = await prisma.notifications.findMany({
            where: {
                receiverId: sellerId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        res.status(200).json({
            success: true,
            notifications,
        });
    } catch (error) {

    }
}

// mark notification as read
export const markNotificationAsRead = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const { notificationId } = req.body;

        if (!notificationId) {
            return next(new ValidationError("Notification id is required!"));
        }

        const notification = await prisma.notifications.update({
            where: { id: notificationId },
            data: { read: true },
        });

        // Code below this line is inferred to complete the logic
        res.status(200).json({
            success: true,
            message: "Notification marked as read",
            data: notification,
        });
    } catch (error) {
        next(error);
    }
};

export const addCategory = async (req: Request, res: Response) => {
    try {
        const { category } = req.body;

        if (!category || !category.trim()) {
            return res.status(400).json({
                message: "Category is required",
            });
        }

        // get existing site config (assuming single document)
        const siteConfig = await prisma.site_config.findFirst();

        if (!siteConfig) {
            // create config if it doesn't exist
            const newConfig = await prisma.site_config.create({
                data: {
                    categories: [category],
                    subCategories: {},
                },
            });

            return res.status(201).json({
                message: "Category added",
                categories: newConfig.categories,
            });
        }

        // prevent duplicates
        if (siteConfig.categories.includes(category)) {
            return res.status(409).json({
                message: "Category already exists",
            });
        }

        const updatedConfig = await prisma.site_config.update({
            where: { id: siteConfig.id },
            data: {
                categories: {
                    push: category,
                },
            },
        });

        return res.status(200).json({
            message: "Category added successfully",
            categories: updatedConfig.categories,
        });
    } catch (error) {
        console.error("Add category error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const addSubCategory = async (req: Request, res: Response) => {
    try {
        const { category, subCategory } = req.body;

        if (!category || !subCategory) {
            return res.status(400).json({
                message: "Category and SubCategory are required",
            });
        }

        const siteConfig = await prisma.site_config.findFirst();

        if (!siteConfig) {
            return res.status(404).json({
                message: "Site config not found",
            });
        }

        // Check category exists
        if (!siteConfig.categories.includes(category)) {
            return res.status(400).json({
                message: "Category does not exist",
            });
        }

        // Clone subCategories object
        const subCategories =
            (siteConfig.subCategories as Record<string, string[]>) || {};

        // Initialize category array if missing
        if (!subCategories[category]) {
            subCategories[category] = [];
        }

        // Prevent duplicate subcategory
        if (subCategories[category].includes(subCategory)) {
            return res.status(409).json({
                message: "Subcategory already exists",
            });
        }

        // Add subcategory
        subCategories[category].push(subCategory);

        const updatedConfig = await prisma.site_config.update({
            where: { id: siteConfig.id },
            data: {
                subCategories,
            },
        });

        return res.status(200).json({
            message: "Subcategory added successfully",
            subCategories: updatedConfig.subCategories,
        });
    } catch (error) {
        console.error("Add subcategory error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

// upload site logo
export const uploadSiteLogo = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { fileName } = req.body;

        if (!fileName) {
            return res.status(400).json({
                message: "Image data is required",
            });
        }

        // Upload to ImageKit
        const response = await imagekit.upload({
            file: fileName,
            fileName: `site-logo-${Date.now()}.jpg`,
            folder: "/site/logo",
        });

        // Save logo URL in DB
        const siteConfig = await prisma.site_config.findFirst();

        if (siteConfig) {
            await prisma.site_config.update({
                where: { id: siteConfig.id },
                data: {
                    logo: response.url,
                },
            });
        } else {
            await prisma.site_config.create({
                data: {
                    categories: [],
                    subCategories: {},
                    logo: response.url,
                },
            });
        }

        res.status(201).json({
            file_url: response.url,
            fileId: response.fileId,
        });
    } catch (error) {
        next(error);
    }
};

// fetch site logo
export const getSiteLogo = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const siteConfig = await prisma.site_config.findFirst({
            select: {
                logo: true,
            },
        });

        if (!siteConfig || !siteConfig.logo) {
            return res.status(200).json({
                logo: null,
            });
        }

        res.status(200).json({
            logo: siteConfig.logo,
        });
    } catch (error) {
        next(error);
    }
};

// upload site banner
export const uploadSiteBanner = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { fileName } = req.body;

        if (!fileName) {
            return res.status(400).json({
                message: "Image data is required",
            });
        }

        // Upload to ImageKit
        const response = await imagekit.upload({
            file: fileName,
            fileName: `site-banner-${Date.now()}.jpg`,
            folder: "/site/banner",
        });

        // Save banner URL in DB
        const siteConfig = await prisma.site_config.findFirst();

        if (siteConfig) {
            await prisma.site_config.update({
                where: { id: siteConfig.id },
                data: {
                    banner: response.url,
                },
            });
        } else {
            await prisma.site_config.create({
                data: {
                    categories: [],
                    subCategories: {},
                    banner: response.url,
                },
            });
        }

        res.status(201).json({
            file_url: response.url,
            fileId: response.fileId,
        });
    } catch (error) {
        next(error);
    }
};

// fetch site banner
export const getSiteBanner = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const siteConfig = await prisma.site_config.findFirst({
            select: {
                banner: true,
            },
        });

        if (!siteConfig || !siteConfig.banner) {
            return res.status(200).json({
                banner: null,
            });
        }

        res.status(200).json({
            banner: siteConfig.banner,
        });
    } catch (error) {
        next(error);
    }
};
