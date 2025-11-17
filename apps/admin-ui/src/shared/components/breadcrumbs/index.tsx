// components/BreadCrumbs.tsx
import Link from "next/link";

interface BreadCrumbsProps {
    title: string;
}

export default function BreadCrumbs({ title }: BreadCrumbsProps) {
    return (
        <nav className="text-sm text-gray-400 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-1">
                {/* Dashboard link */}
                <li>
                    <Link href="/dashboard" className="hover:text-gray-200 transition">
                        Dashboard
                    </Link>
                </li>

                {/* Separator */}
                <li>
                    <span className="px-1 text-gray-500">›</span>
                </li>

                {/* Current Page */}
                <li aria-current="page">
                    <span className="text-white font-medium">{title}</span>
                </li>
            </ol>
        </nav>
    );
}
