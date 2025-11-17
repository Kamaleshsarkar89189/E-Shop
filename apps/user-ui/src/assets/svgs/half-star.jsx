// e.g., src/assets/svg/HalfStar.jsx

import React from 'react';

const HalfStar = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <defs>
            {/* This defines a clipping mask that covers the left half of the icon */}
            <clipPath id="clip-half-star">
                <rect x="0" y="0" width="12" height="24" />
            </clipPath>
        </defs>

        {/* This path renders the filled part of the star, clipped by the mask */}
        <path
            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            fill="currentColor"
            strokeWidth="0"
            clipPath="url(#clip-half-star)"
        />

        {/* This path renders the full outline on top of everything */}
        <path
            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            fill="none"
        />
    </svg>
);

export default HalfStar;