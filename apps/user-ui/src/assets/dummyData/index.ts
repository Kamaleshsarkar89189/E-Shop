export const dummyProducts = [
    {
        id: "1",
        title: "Wireless Headphones",
        slug: "wireless-headphones",
        sale_price: 59.99,
        regular_price: 79.99,
        ratings: 5,
        stock: 10,
        totalSales: 120,
        images: [
            { url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8" }
        ],
        Shop: {
            id: "shop1",
            name: "Tech Store",
            avatar: "https://images.unsplash.com/photo-1518770660439-4636190af475"
        },
        ending_date: "2025-09-10T23:59:59Z", // for event products
    },
    {
        id: "2",
        title: "Smart Watch",
        slug: "smart-watch",
        sale_price: 99.99,
        regular_price: 149.99,
        ratings: 5,
        stock: 3, // will trigger "Limited Stock"
        totalSales: 85,
        images: [
            { url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30" }
        ],
        Shop: {
            id: "shop2",
            name: "Gadget Hub",
            avatar: "https://images.unsplash.com/photo-1518770660439-4636190af475"
        },
        ending_date: null, // non-event or no end date
    },
    {
        id: "3",
        title: "Gaming Laptop",
        slug: "gaming-laptop",
        sale_price: 1299.99,
        regular_price: 1499.99,
        ratings: 5,
        stock: 8,
        totalSales: 45,
        images: [
            { url: "https://images.unsplash.com/photo-1518770660439-4636190af475" }
        ],
        Shop: {
            id: "shop3",
            name: "Laptop World",
            avatar: "https://images.unsplash.com/photo-1518770660439-4636190af475"
        },
        ending_date: "2025-09-05T18:00:00Z",
    },
];
