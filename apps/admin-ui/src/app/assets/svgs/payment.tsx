import React from "react";

type Props = {
    fill?: string;
    size?: number;
};

const Payment: React.FC<Props> = ({ fill = "currentColor", size = 24 }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10 16V8C10 6.9 10.89 6 12 6H21V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V12H12C10.9 12 10 12.9 10 14V16Z"
                fill={fill}
            />
        </svg>
    );
};

export default Payment;
