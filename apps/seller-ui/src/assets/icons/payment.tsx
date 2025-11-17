import React from "react";

const Payment = ({ fill = "#475569" }: { fill?: string }) => {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Card outline */}
            <rect
                x="3"
                y="5"
                width="18"
                height="14"
                rx="2"
                ry="2"
                stroke={fill}
                strokeWidth="1.5"
                fill="none"
            />
            {/* Stripe */}
            <rect x="3" y="8" width="18" height="2" fill={fill} />
            {/* Small payment lines */}
            <rect x="6" y="13" width="4" height="1.5" rx="0.5" fill={fill} />
            <rect x="12" y="13" width="6" height="1.5" rx="0.5" fill={fill} />
        </svg>
    );
};

export default Payment;
