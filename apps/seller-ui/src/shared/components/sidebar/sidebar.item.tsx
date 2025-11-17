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
import { clsx } from 'clsx'; // A tiny utility for constructing className strings conditionally

interface Props {
    title: string;
    icon: React.ReactNode;
    isActive?: boolean;
    href: string;
}

const SidebarItem = ({ icon, title, isActive, href }: Props) => {
    return (
        <Link
            href={href}
            // The clsx utility makes combining conditional classes very clean
            className={clsx(
                // Base classes for all states
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-300 transition-all duration-200',
                {
                    // Classes applied only when isActive is true
                    'bg-sky-900 text-white scale-[.98] hover:!bg-[#0f3158d6]': isActive,
                    // Classes applied only when isActive is false
                    'hover:bg-gray-800': !isActive,
                }
            )}
        >
            {/* The icon will inherit the text color (e.g., text-white) from the parent Link */}
            <div className="h-5 w-5">{icon}</div>

            {/* Using a <span> is more semantic here than a heading tag */}
            <span className="text-sm font-medium">{title}</span>
        </Link>
    );
};

export default SidebarItem;