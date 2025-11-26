// import Link from 'next/link';
// import React from 'react';

// interface Props {
//     title: string;
//     icon: React.ReactNode;
//     isActive?: boolean;
//     href: string;
// }

// const SidebarItem = ({ icon, title, isActive, href }: Props) => {
//     return (
//         <Link href={href} className='my-2 block'>
//             <div className={`flex gap-3 w-full max-h-12 h-full items-center px-[13px] rounded-lg cursor-pointer transition hover:bg-[#2b2f31] ${isActive && "scale-[.98] bg-[#0f3158] fill-blue-200 hover:!bg-[#0f3158d6]"}`}>
//                 {icon}
//                 <h5 className='text-slate-200 text-lg'>{title}</h5>
//             </div>
//         </Link>
//     )
// }

// export default SidebarItem;



// components/SidebarItem.tsx

import Link from 'next/link';
import React from 'react';
import { clsx } from 'clsx';

interface Props {
    title: string;
    icon: React.ReactNode;
    isActive?: boolean;
    href?: string;       // href becomes optional
    onClick?: () => void; // new onClick support
}

const SidebarItem = ({ icon, title, isActive, href, onClick }: Props) => {
    const baseClasses = clsx(
        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-300 transition-all duration-200 w-full',
        {
            'bg-sky-900 text-white scale-[.98] hover:!bg-[#0f3158d6]': isActive,
            'hover:bg-gray-800': !isActive,
        }
    );

    // If onClick is provided → render a button instead of a Link
    if (onClick) {
        return (
            <button
                onClick={onClick}
                className={baseClasses}
            >
                <div className="h-5 w-5">{icon}</div>
                <span className="text-sm font-medium">{title}</span>
            </button>
        );
    }

    // Otherwise → normal navigation Link
    return (
        <Link href={href!} className={baseClasses}>
            <div className="h-5 w-5">{icon}</div>
            <span className="text-sm font-medium">{title}</span>
        </Link>
    );
};

export default SidebarItem;
