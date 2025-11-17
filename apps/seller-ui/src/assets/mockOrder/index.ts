// mockOrders.ts

export interface OrderItem {
    productId: string;
    name: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    user: {
        name: string;
    };
    total: number;
    status: string;
    createdAt: string;
    items: OrderItem[];
}

export const mockOrders: Order[] = [
    {
        id: "66f0a1a3e7a1f20000000111",
        user: { name: "Alice Johnson" },
        total: 1200.5,
        status: "Paid",
        createdAt: "2025-09-10T14:20:00Z",
        items: [
            { productId: "p101", name: "Wireless Headphones", quantity: 1, price: 200.5 },
            { productId: "p102", name: "Laptop", quantity: 1, price: 1000 },
        ],
    },
    {
        id: "66f0a1a3e7a1f20000000222",
        user: { name: "Bob Smith" },
        total: 850.0,
        status: "Pending",
        createdAt: "2025-09-12T10:15:00Z",
        items: [
            { productId: "p103", name: "Smartphone", quantity: 1, price: 750 },
            { productId: "p104", name: "Phone Case", quantity: 2, price: 50 },
        ],
    },
    {
        id: "66f0a1a3e7a1f20000000333",
        user: { name: "Charlie Brown" },
        total: 450.75,
        status: "Paid",
        createdAt: "2025-09-14T08:45:00Z",
        items: [
            { productId: "p105", name: "Bluetooth Speaker", quantity: 1, price: 150.75 },
            { productId: "p106", name: "Gaming Mouse", quantity: 1, price: 300 },
        ],
    },
    {
        id: "66f0a1a3e7a1f20000000444",
        user: { name: "Diana Prince" },
        total: 2300.0,
        status: "Shipped",
        createdAt: "2025-09-15T17:30:00Z",
        items: [
            { productId: "p107", name: "4K TV", quantity: 1, price: 2000 },
            { productId: "p108", name: "HDMI Cable", quantity: 2, price: 300 },
        ],
    },
    {
        id: "66f0a1a3e7a1f20000000555",
        user: { name: "Ethan Hunt" },
        total: 999.99,
        status: "Delivered",
        createdAt: "2025-09-16T09:00:00Z",
        items: [
            { productId: "p109", name: "Drone Camera", quantity: 1, price: 999.99 },
        ],
    },
];
