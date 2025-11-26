// import Link from "next/link";
// import React from "react";

// interface Props {
//     title: string;
//     icon: React.ReactNode;
//     isActive?: boolean;
//     href: string;
//     onClick?: () => void;
// }

// const SidebarItem = ({ icon, title, isActive, href, onClick }: Props) => {
//     return (
//         <Link href={href} className="my-2 block">
//             <div
//                 className={`flex gap-2 w-full min-h-12 h-full items-center px-[13px] rounded-lg ${isActive &&
//                     "scale-[.98] bg-[#0f3158] fill-blue-200 hover:!bg-[#0f3158d6]"
//                     }`}
//             >
//                 {icon}
//                 <h5 className="text-slate-200  text-lg">{title}</h5>
//             </div>
//         </Link>
//     );
// };

// export default SidebarItem;


import Link from "next/link";
import React from "react";

interface Props {
    title: string;
    icon: React.ReactNode;
    isActive?: boolean;
    href?: string;
    onClick?: () => void;
}

const SidebarItem = ({ icon, title, isActive, href, onClick }: Props) => {
    const className = `flex gap-2 w-full min-h-12 h-full items-center px-[13px] rounded-lg ${isActive &&
        "scale-[.98] bg-[#0f3158] fill-blue-200 hover:!bg-[#0f3158d6]"
        }`;

    // If onClick exists → treat as button (logout)
    if (onClick) {
        return (
            <button
                onClick={onClick}
                className={`my-2 block text-left w-full ${className}`}
            >
                {icon}
                <h5 className="text-slate-200 text-lg">{title}</h5>
            </button>
        );
    }

    // Otherwise normal Link
    return (
        <Link href={href!} className="my-2 block">
            <div className={className}>
                {icon}
                <h5 className="text-slate-200 text-lg">{title}</h5>
            </div>
        </Link>
    );
};

export default SidebarItem;
