"use client";

import React, { useEffect, useState } from "react";
import BreadCrumbs from "apps/admin-ui/src/shared/components/breadcrumbs";
import axiosInstance from "apps/admin-ui/src/utils/axiosInstance";

const tabs = ["Categories", "Logo", "Banner"];

const Customization = () => {
    const [activeTab, setActiveTab] = useState("Categories");

    const [categories, setCategories] = useState<string[]>([]);
    const [subCategories, setSubCategories] = useState<Record<string, string[]>>(
        {}
    );

    const [logo, setLogo] = useState<string | null>(null);
    const [banner, setBanner] = useState<string | null>(null);

    const [newCategory, setNewCategory] = useState("");
    const [newSubCategory, setNewSubCategory] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [logoLoading, setLogoLoading] = useState(false);

    useEffect(() => {
        const fetchCustomization = async () => {
            try {
                const res = await axiosInstance.get("/admin/api/get-all");
                const data = res.data;

                setCategories(data.categories || []);
                setSubCategories(data.subCategories || {});
                setLogo(data.logo || null);
                setBanner(data.banner || null);
            } catch (err) {
                console.error("Failed to fetch customization data", err);
            }
        };

        fetchCustomization()
    }, []);

    const handleAddCategory = async () => {
        if (!newCategory.trim()) return;
        try {
            await axiosInstance.post("/admin/api/add-category", {
                category: newCategory,
            });
            setCategories((prev) => [...prev, newCategory]);
            setNewCategory("");
        } catch (error) {
            console.error("Error adding category", error);
        }
    };

    const handleAddSubCategory = async () => {
        if (!newSubCategory.trim() || !selectedCategory) return;
        try {
            await axiosInstance.post("/admin/api/add-subcategory", {
                category: selectedCategory,
                subCategory: newSubCategory,
            });
            setSubCategories((prev) => ({
                ...prev,
                [selectedCategory]: [...(prev[selectedCategory] || []), newSubCategory],
            }));
            setNewSubCategory("");
        } catch (error) {
            console.error("Error adding subcategory", error);
        }
    };

    const convertFileToBase64 = (file: File) => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleLogoChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const base64 = await convertFileToBase64(file);

            const res = await axiosInstance.post(
                "/admin/api/upload-site-logo",
                {
                    fileName: base64, // ✅ backend expects this
                }
            );

            setLogo(res.data.file_url); // returned from ImageKit
        } catch (error) {
            console.error("Error changing logo", error);
        }
    };

    const handleBannerChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const base64 = await convertFileToBase64(file);

        const res = await axiosInstance.post(
            "/admin/api/upload-site-banner",
            { fileName: base64 }
        );

        setBanner(res.data.file_url);
    };

    const fetchLogo = async () => {
        try {
            setLogoLoading(true);
            const res = await axiosInstance.get("/admin/api/get-site-logo");
            setLogo(res.data.logo);
            console.log("Logo", JSON.stringify(res))
        } catch (error) {
            console.error(error);
        } finally {
            setLogoLoading(false);
        }
    };


    useEffect(() => {
        if (activeTab === "Logo") {
            fetchLogo();
        }
    }, [activeTab]);



    return (
        <div className="w-full min-h-screen p-8 bg-[#0c0c0c] text-white">
            <h2 className="text-2xl font-semibold mb-2">Customization</h2>
            <BreadCrumbs title="Customization" />

            {/* Tabs */}
            <div className="flex items-center gap-6 mt-6 border-b border-gray-700 pb-2">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`text-sm font-medium pb-2 border-b-2 transition-all duration-200 ${activeTab === tab
                            ? "border-blue-500 text-blue-400"
                            : "border-transparent text-gray-400 hover:text-gray-200"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Categories */}
            {activeTab === "Categories" && (
                <div className="mt-8 space-y-8 gap-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {categories.map((cat) => (
                            <div key={cat}>
                                <h3 className="font-semibold text-lg mb-2">{cat}</h3>
                                <ul className="ml-4 space-y-1 text-gray-300 text-sm">
                                    {(subCategories[cat] || []).map((sub) => (
                                        <li key={sub}>• {sub}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Add Category */}
                    <div className="flex items-center gap-2 mt-4">
                        <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="New category"
                            className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm w-64 focus:outline-none focus:border-blue-500"
                        />
                        <button
                            onClick={handleAddCategory}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium"
                        >
                            Add Category
                        </button>
                    </div>

                    {/* Add Subcategory */}
                    <div className="flex flex-wrap items-center gap-2 mt-4">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Select category</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>

                        <input
                            type="text"
                            value={newSubCategory}
                            onChange={(e) => setNewSubCategory(e.target.value)}
                            placeholder="New subcategory"
                            className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm w-64 focus:outline-none focus:border-blue-500"
                        />
                        <button
                            onClick={handleAddSubCategory}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium"
                        >
                            Add Subcategory
                        </button>
                    </div>
                </div>
            )}

            {activeTab === "Logo" && (
                <div className="mt-10 text-gray-300 text-sm space-y-4">
                    <p>Upload or update your website logo here.</p>

                    <div className="bg-gray-800/60 p-4 rounded-xl flex items-center justify-between shadow-md">
                        <div className="flex items-center gap-4">
                            {logoLoading ? (
                                <div className="w-20 h-20 bg-gray-700 animate-pulse rounded-md" />
                            ) : (
                                <img
                                    src={logo || ""}
                                    alt="Logo"
                                    className="w-20 h-20 object-contain rounded-md border border-gray-700"
                                />
                            )}

                            <div>
                                <p className="text-gray-200 font-medium">Logo</p>
                                <p className="text-gray-400 text-xs">
                                    Click below to replace it
                                </p>
                            </div>
                        </div>

                        <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition">
                            Change Logo
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleLogoChange}
                            />
                        </label>
                    </div>
                </div>
            )}

            {activeTab === "Banner" && (
                <div className="mt-10 text-gray-300 text-sm space-y-4">
                    <p>Upload or manage your homepage banner images here.</p>

                    <div className="bg-gray-800/60 p-4 rounded-xl flex flex-col gap-4 shadow-md">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <img
                                    src={banner || "https://imgs.search.brave.com/eyRY5uaiLGM5frGLLGO6FeKUxOITJRXh-mf56aSPzWY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWd2/My5mb3Rvci5jb20v/aW1hZ2VzL2hvbWVw/YWdlLWZlYXR1cmUt/Y2FyZC9mb3Rvci0z/ZC1hdmF0YXIuanBn"}
                                    alt="Banner"
                                    className="w-48 h-24 object-cover rounded-md border border-gray-700"
                                />
                                <div>
                                    <p className="text-gray-200 font-medium">Banner</p>
                                    <p className="text-gray-400 text-xs">Click below to replace it</p>
                                </div>
                            </div>

                            <label className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg cursor-pointer transition">
                                Change Banner
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleBannerChange}
                                />
                            </label>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Customization;