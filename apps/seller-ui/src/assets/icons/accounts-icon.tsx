import React from "react";

const AccountsIcon = ({ fill = "#475569" }: { fill?: string }) => {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Head */}
            <circle cx="12" cy="8" r="4" fill={fill} />
            {/* Body */}
            <path
                d="M4 20c0-3.3137 3.134-6 8-6s8 2.6863 8 6v1H4v-1z"
                fill={fill}
            />
        </svg>
    );
};

export default AccountsIcon;
