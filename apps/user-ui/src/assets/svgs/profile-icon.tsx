import React from "react";

const ProfileIcon = (props: any) => (
    <svg
        width={20}
        height={23}
        viewBox="0 0 17 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <circle
            cx={8.57894}
            cy={5.77803}
            r={4.77803}
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1 20C1 16 5 13 9 13C13 13 17 16 17 20"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default ProfileIcon;
