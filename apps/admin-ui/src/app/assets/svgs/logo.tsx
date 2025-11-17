import React from "react";

const Logo: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-[45px] border border-slate-800 rounded-md">
            <svg
                width="45"
                height="45"
                viewBox="0 0 56 56"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-500"
            >
                <rect
                    x="0.5"
                    y="0.5"
                    width="55"
                    height="55"
                    rx="7.5"
                    stroke="currentColor"
                />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M20.0007 29.3334C19.2673 29.3334 18.6673 29.9334 18.6673 30.6667V37.3334C18.6673 38.0667 19.2673 38.6667 20.0007 38.6667H36.0007C36.734 38.6667 37.334 38.0667 37.334 37.3334V30.6667C37.334 29.9334 36.734 29.3334 36.0007 29.3334H20.0007ZM28.0007 26.6667C29.4733 26.6667 30.6673 25.4734 30.6673 24.0001C30.6673 22.5267 29.4733 21.3334 28.0007 21.3334C26.528 21.3334 25.334 22.5267 25.334 24.0001C25.334 25.4734 26.528 26.6667 28.0007 26.6667Z"
                    fill="currentColor"
                />
            </svg>
        </div>
    );
};

export default Logo;
