"use client";

import BreadCrumbs from "apps/admin-ui/src/shared/components/breadcrumbs";
import React, { useMemo, useState, useDeferredValue } from "react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from "@tanstack/react-table";
import { Search, Download, Ban, AlertTriangle } from "lucide-react";
import {
    useQuery,
    useMutation,
    useQueryClient,
    UseQueryResult,
} from "@tanstack/react-query";
import { saveAs } from "file-saver";
import axiosInstance from "apps/admin-ui/src/utils/axiosInstance";
import Image from "next/image";

type User = {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
};

type UsersResponse = {
    data: User[];
    meta: {
        totalSellers: number;
    };
};

const UserPage = () => {
    const [globalFilter, setGlobalFilter] = useState("");
    const [page, setPage] = useState(1);
    const [roleFilter, setRoleFilter] = useState("");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const deferredGlobalFilter = useDeferredValue(globalFilter);
    const limit = 10;
    const queryClient = useQueryClient();

    const { data, isLoading }: UseQueryResult<UsersResponse, Error> = useQuery<
        UsersResponse,
        Error,
        UsersResponse,
        [string, number]
    >({
        queryKey: ["sellers-list", page],
        queryFn: async () => {
            const res = await axiosInstance.get(
                `/admin/api/get-all-sellers?page=${page}&limit=${limit}`
            );
            return res.data;
        },
        placeholderData: (previousData) => previousData,
        staleTime: 1000 * 60 * 5,
    });

    const banUserMutation = useMutation({
        mutationFn: async (userId: string) => {
            await axiosInstance.put(`/admin/api/ban-user/${userId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users-list"] });
            setIsModalOpen(false);
            setSelectedUser(null);
        },
    });

    const allSellers = data?.data || [];

    const filteredSellers = useMemo(() => {
        return allSellers.filter((seller) =>
            deferredGlobalFilter
                ? Object.values(seller)
                    .map((v) => (typeof v === "string" ? v : JSON.stringify(v)))
                    .join(" ")
                    .toLowerCase()
                    .includes(deferredGlobalFilter.toLowerCase())
                : true
        );
    }, [allSellers, deferredGlobalFilter]);

    const totalPages = Math.ceil((data?.meta?.totalSellers ?? 0) / limit);

    const columns = useMemo(
        () => [
            {
                accessorKey: "shop.avatar",
                header: "Avatar",
                cell: ({ row }: any) => (
                    <Image
                        src={row.original.shop?.avatar || "https://imgs.search.brave.com/eyRY5uaiLGM5frGLLGO6FeKUxOITJRXh-mf56aSPzWY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWd2/My5mb3Rvci5jb20v/aW1hZ2VzL2hvbWVw/YWdlLWZlYXR1cmUt/Y2FyZC9mb3Rvci0z/ZC1hdmF0YXIuanBn"}
                        alt={row.original.name}
                        width={40}
                        height={40}
                        className="rounded-full w-10 h-10 object-cover"
                    />
                ),
            },
            {
                accessorKey: "name",
                header: "Name",
            },
            {
                accessorKey: "email",
                header: "Email",
            },
            {
                accessorKey: "shop.name",
                header: "Shop Name",
                cell: ({ row }: any) => {
                    const shopName = row.original.shop?.name;
                    return shopName ? (
                        <a
                            href={`${process.env.NEXT_PUBLIC_USER_UI_LINK}/shop/${row.original.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline"
                        >
                            {shopName}
                        </a>
                    ) : (
                        <span className="text-gray-400 italic">No Shop</span>
                    );
                },
            },
            {
                accessorKey: "shop.address",
                header: "Address",
            },
            {
                accessorKey: "createdAt",
                header: "Joined",
                cell: (info: any) =>
                    new Date(info.row.original.createdAt).toLocaleDateString(),
            },
        ],
        []
    );

    const table = useReactTable({
        data: filteredSellers,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const exportToCSV = () => {
        const csvData = filteredSellers.map(
            (u) => `${u.name},${u.email},${u.role},${u.createdAt}`
        );
        const blob = new Blob(
            [`Name,Email,Role,Joined\n${csvData.join("\n")}`],
            { type: "text/csv;charset=utf-8" }
        );
        saveAs(blob, `users-page-${page}.csv`);
    };

    return (
        <div className="w-full min-h-screen p-8 bg-black text-white text-sm">
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-bold tracking-wide">All Users</h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={exportToCSV}
                        className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md"
                    >
                        <Download size={16} /> Export CSV
                    </button>
                    <select
                        className="bg-gray-900 border border-gray-700 rounded-md px-2 py-1 text-white outline-none"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                </div>
            </div>

            {/* Breadcrumbs */}
            <div className="mb-4">
                <BreadCrumbs title="All Users" />
            </div>

            {/* Search Bar */}
            <div className="mb-4 flex items-center bg-gray-900 p-2 rounded-md flex-1">
                <Search size={18} className="text-gray-400 mr-2" />
                <input
                    type="text"
                    placeholder="Search users..."
                    className="w-full bg-transparent text-white outline-none"
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-gray-900 rounded-lg shadow-md">
                <table className="w-full text-left">
                    <thead className="bg-gray-800 text-gray-300 uppercase text-xs">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id} className="px-4 py-3">
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row) => (
                            <tr
                                key={row.id}
                                className="border-b border-gray-800 hover:bg-gray-800/60"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="px-4 py-3">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    className={`px-3 py-1 rounded-md ${page === 1
                        ? "bg-gray-800 text-gray-500"
                        : "bg-gray-700 hover:bg-gray-600 text-white"
                        }`}
                >
                    Previous
                </button>

                <p className="text-gray-400">
                    Page {page} of {totalPages || 1}
                </p>

                <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className={`px-3 py-1 rounded-md ${page >= totalPages
                        ? "bg-gray-800 text-gray-500"
                        : "bg-gray-700 hover:bg-gray-600 text-white"
                        }`}
                >
                    Next
                </button>
            </div>

            {/* Ban User Modal */}
            {isModalOpen && selectedUser && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
                    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-[320px] text-center shadow-lg">
                        <h3 className="text-lg font-semibold mb-3">Ban User</h3>
                        <div className="flex items-start gap-2 text-yellow-400 justify-center mb-2">
                            <AlertTriangle size={18} className="mt-0.5" />
                            <p className="text-sm text-gray-300">
                                <span className="text-yellow-400 font-medium">Important:</span>{" "}
                                Are you sure you want to ban{" "}
                                <span className="text-red-400 font-semibold">
                                    {selectedUser.name}
                                </span>
                                ? <br />
                                This action can be reverted later.
                            </p>
                        </div>
                        <div className="flex justify-center gap-3 mt-5">
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setSelectedUser(null);
                                }}
                                className="px-4 py-1.5 rounded-md bg-gray-700 hover:bg-gray-600 text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => banUserMutation.mutate(selectedUser.id)}
                                className="px-4 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white flex items-center gap-1"
                            >
                                <Ban size={14} /> Confirm Ban
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserPage;