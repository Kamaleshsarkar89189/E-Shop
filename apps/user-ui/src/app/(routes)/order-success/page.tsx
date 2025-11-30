"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";

export default function OrderSuccess() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const orderId = searchParams.get("orderId");

    const [countdown, setCountdown] = useState(5); // 👈 countdown state

    useEffect(() => {
        // countdown timer
        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    router.push(`/profile?active=My+Orders`);
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">

                <CheckCircle className="text-green-600 w-16 h-16 mx-auto mb-4" />

                <h1 className="text-2xl font-semibold mb-2 text-gray-900">
                    Order Placed Successfully!
                </h1>

                <p className="text-gray-700 mb-6">
                    Thank you for your order. Your items will be delivered soon.
                </p>

                <button
                    onClick={() => router.push(`/profile?active=My+Orders`)}
                    className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                >
                    View Order Details
                </button>

                <p className="text-gray-500 text-sm mt-4">
                    Redirecting automatically in <span className="font-semibold">{countdown}</span> seconds...
                </p>
            </div>
        </div>
    );
}
