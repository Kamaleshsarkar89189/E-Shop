import React from "react";

type Props = {
    fill?: string;
    size?: number;
};

const Home: React.FC<Props> = ({ fill = "currentColor", size = 24 }) => {
    return (
        <svg
            height={size}
            width={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4 13H10C10.55 13 11 12.55 11 12V4C11 3.45 10.55 3 10 3H4C3.45 3 3 3.45 3 4V12C3 12.55 3.45 13 4 13ZM14 13H20C20.55 13 21 12.55 21 12V4C21 3.45 20.55 3 20 3H14C13.45 3 13 3.45 13 4V12C13 12.55 13.45 13 14 13ZM4 21H10C10.55 21 11 20.55 11 20V16C11 15.45 10.55 15 10 15H4C3.45 15 3 15.45 3 16V20C3 20.55 3.45 21 4 21ZM14 21H20C20.55 21 21 20.55 21 20V16C21 15.45 20.55 15 20 15H14C13.45 15 13 15.45 13 16V20C13 20.55 13.45 21 14 21Z"
                fill={fill}
            />
        </svg>
    );
};

export default Home;
