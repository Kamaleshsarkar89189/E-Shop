import React from "react";

const DashboardIcon = ({ fill = "#3b82f6" }: { fill?: string }) => {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Top-left square */}
            <rect x="3" y="3" width="7" height="7" rx="1.5" fill={fill} />
            {/* Top-right square */}
            <rect x="14" y="3" width="7" height="7" rx="1.5" fill={fill} />
            {/* Bottom-left square */}
            <rect x="3" y="14" width="7" height="7" rx="1.5" fill={fill} />
            {/* Bottom-right square */}
            <rect x="14" y="14" width="7" height="7" rx="1.5" fill={fill} />
        </svg>
    );
};

export default DashboardIcon;
