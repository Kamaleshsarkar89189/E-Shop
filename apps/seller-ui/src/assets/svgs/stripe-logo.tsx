import * as React from "react";

const StripeLogo = (props: any) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 28.87 28.87"
        width={25}
        height={25}
        id="stripe"
        {...props}
    >
        <g>
            {/* Background */}
            <rect
                width={28.87}
                height={28.87}
                rx={6.48}
                ry={6.48}
                fill="#635bff"
            />

            {/* Stripe “S” logo (requires multiple paths) */}
            <path
                d="M13.3 11.2c0-.69.57-1 1.49-1a9.84 9.84 0 0 1 4.37 1.13v7.24a11.6 11.6 0 0 1-4.63.88c-1.56 0-1.23-.75-1.23-1.27v-7.98Z"
                fill="#fff"
                fillRule="evenodd"
            />
            <path
                d="M18.1 13.4c-.6-.38-1.45-.57-2.36-.57-1.12 0-1.83.42-1.83 1.04 0 .68.72.91 1.61 1l.66.09c1.99.27 3.11 1.05 3.11 2.8 0 1.82-1.52 2.88-3.8 2.88-1.2 0-2.26-.25-3.09-.73v-1.86c.88.56 1.95.82 3.09.82 1.17 0 1.92-.47 1.92-1.2 0-.63-.48-.99-1.55-1.13l-.66-.09c-2-.28-3.18-1.1-3.18-2.77 0-1.71 1.44-2.75 3.6-2.75 1.11 0 2.02.22 2.67.59v1.98Z"
                fill="#fff"
                fillRule="evenodd"
            />
        </g>
    </svg>
);

export default StripeLogo;
