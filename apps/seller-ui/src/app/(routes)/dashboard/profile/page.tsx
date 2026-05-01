// "use client";
// // @ts-ignore
// import { shops } from "@prisma/client";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import axiosInstance from "apps/user-ui/src/utils/axiosInstance";
// import {
//   Calendar,
//   Clock,
//   Globe,
//   Heart,
//   MapPin,
//   Star,
//   Users,
//   XIcon,
//   YoutubeIcon,
//   Edit2, // Added for Edit button
//   Check, // Added for Save button
//   X,     // Added for Cancel button
// } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import React, { useEffect, useState } from "react";
// import useLocationTracking from "apps/user-ui/src/hooks/useLocationTracking";
// import useDeviceTracking from "apps/user-ui/src/hooks/useDeviceTracking";
// import useUser from "apps/user-ui/src/hooks/useUser";
// import { sendKafkaEvent } from "apps/user-ui/src/actions/track-user";
// import ProductCard from "apps/seller-ui/src/shared/components/cards/product-card";

// const TABS = ["Products", "Offers", "Reviews"];

// const SellerProfile = ({
//   shop,
//   followersCount,
// }: {
//   shop: shops;
//   followersCount: number;
// }) => {
//   const [activeTab, setActiveTab] = useState("Products");
//   const [followers, setFollowers] = useState(followersCount);
//   const [isFollowing, setIsFollowing] = useState(false);

//   // --- New State for Editing ---
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({
//     name: shop?.name || "",
//     bio: shop?.bio || "",
//     opening_hours: shop?.opening_hours || "",
//     address: shop?.address || "",
//     website: shop?.website || "",
//   });

//   const { user } = useUser();
//   const location = useLocationTracking();
//   const deviceInfo = useDeviceTracking();
//   const queryClient = useQueryClient();

//   // --- Update Mutation ---
//   const updateShopMutation = useMutation({
//     mutationFn: async (updatedData: Partial<shops>) => {
//       const res = await axiosInstance.put(`/product/api/update-shop/${shop?.id}`, updatedData);
//       return res.data;
//     },
//     onSuccess: () => {
//       setIsEditing(false);
//       queryClient.invalidateQueries({ queryKey: ["seller-products"] }); // Invalidate relevant queries
//       // If you have a 'my-shop' query, invalidate that here too
//     },
//     onError: (error) => {
//       console.error("Failed to update shop", error);
//       alert("Failed to save changes.");
//     }
//   });

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSave = () => {
//     updateShopMutation.mutate(formData);
//   };

//   const { data: products, isLoading } = useQuery({
//     queryKey: ["seller-products"],
//     queryFn: async () => {
//       const res = await axiosInstance.get(
//         `/product/api/get-seller-products/${shop?.id}?page=1&limit=10`
//       );
//       return res.data.products;
//     },
//     staleTime: 1000 * 60 * 5,
//   });

//   useEffect(() => {
//     const fetchFollowStatus = async () => {
//       if (!shop?.id) return;
//       try {
//         const res = await axiosInstance.get(
//           `/product/api/is-following/${shop?.id}`,
//           {
//             params: { userId: user.id },
//           }
//         );
//         setIsFollowing(res.data.isFollowing !== null);
//       } catch (error) {
//         console.error("Failed to fetch follow status", error);
//       }
//     };

//     fetchFollowStatus();
//   }, [shop?.id]);

//   const { data: events, isLoading: isEventsLoading } = useQuery({
//     queryKey: ["seller-events"],
//     enabled: !!shop?.id,
//     queryFn: async () => {
//       const res = await axiosInstance.get(
//         `/product/api/get-seller-events/${shop?.id}?page=1&limit=10`
//       );
//       return res.data.products;
//     },
//     staleTime: 1000 * 60 * 5,
//   });

//   useEffect(() => {
//     if (!isLoading) {
//       if (!location || !deviceInfo || !user?.id) return;
//       sendKafkaEvent({
//         userId: user?.id,
//         shopId: shop?.id,
//         action: "shop_visit",
//         country: location?.country || "Unknown",
//         city: location?.city || "Unknown",
//         device: deviceInfo || "Unknown Device",
//       });
//     }
//   }, [location, deviceInfo, isLoading]);

//   return (
//     <div>
//       <div className="relative w-full flex justify-center">
//         <Image
//           src={
//             shop?.coverBanner ||
//             "https://ik.imagekit.io/kamaleshsarkar/products/product-1758392401303_ngI1a_Fom.jpg"
//           }
//           alt="Seller Cover"
//           className="w-full h-[400px] object-cover"
//           width={1200}
//           height={300}
//         />
//       </div>

//       {/* Seller Info Section */}
//       <div className="w-[85%] lg:w-[70%] mt-[-50px] mx-auto relative z-20 flex flex-col lg:flex-row gap-6">
//         <div className="bg-gray-200 p-6 rounded-lg shadow-lg flex-1 relative">

//           {/* Edit / Actions Toggle Button */}
//           <div className="absolute top-4 right-4 flex gap-2">
//             {!isEditing ? (
//               <button
//                 onClick={() => setIsEditing(true)}
//                 className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition text-slate-700"
//               >
//                 <Edit2 size={18} />
//               </button>
//             ) : (
//               <>
//                 <button
//                   onClick={handleSave}
//                   disabled={updateShopMutation.isPending}
//                   className="p-2 bg-green-500 text-white rounded-full shadow hover:bg-green-600 transition"
//                 >
//                   <Check size={18} />
//                 </button>
//                 <button
//                   onClick={() => setIsEditing(false)}
//                   className="p-2 bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition"
//                 >
//                   <X size={18} />
//                 </button>
//               </>
//             )}
//           </div>

//           <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
//             <div className="relative w-[100px] h-[100px] rounded-full border-4 border-slate-300 overflow-hidden">
//               <Image
//                 src={
//                   shop?.avatar ||
//                   "https://ik.imagekit.io/kamaleshsarkar/products/product-1758392410558_C5Yrijl2gR.jpg"
//                 }
//                 alt="Seller Avatar"
//                 layout="fill"
//                 objectFit="cover"
//               />
//             </div>

//             <div className="flex-1 w-full">
//               {isEditing ? (
//                 <input
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   className="text-2xl font-semibold text-slate-900 bg-white border border-blue-400 rounded px-2 w-full mb-2 outline-none"
//                   placeholder="Shop Name"
//                 />
//               ) : (
//                 <h1 className="text-2xl font-semibold text-slate-900">
//                   {formData.name || "No name available!"}
//                 </h1>
//               )}

//               {isEditing ? (
//                 <textarea
//                   name="bio"
//                   value={formData.bio}
//                   onChange={handleInputChange}
//                   className="text-slate-800 text-sm mt-1 bg-white border border-blue-400 rounded px-2 w-full h-20 outline-none"
//                   placeholder="Shop Bio"
//                 />
//               ) : (
//                 <p className="text-slate-800 text-sm mt-1">
//                   {formData.bio || "No bio available."}
//                 </p>
//               )}

//               <div className="flex items-center gap-4 mt-2">
//                 <div className="flex items-center text-blue-400 gap-1">
//                   <Star fill="#60a5fa" size={18} />{" "}
//                   <span>{shop?.ratings || "N/A"}</span>
//                 </div>
//                 <div className="flex items-center text-slate-700 gap-1">
//                   <Users size={18} /> <span>{followers} Followers</span>
//                 </div>
//               </div>

//               <div className="flex items-center gap-3 mt-3 text-slate-700">
//                 <Clock size={18} />
//                 {isEditing ? (
//                   <input
//                     name="opening_hours"
//                     value={formData.opening_hours}
//                     onChange={handleInputChange}
//                     className="bg-white border border-blue-400 rounded px-2 py-1 flex-1 outline-none text-sm"
//                     placeholder="e.g. Mon - Sat: 9 AM - 6 PM"
//                   />
//                 ) : (
//                   <span>{formData.opening_hours || "Mon - Sat: 9 AM - 6 PM"}</span>
//                 )}
//               </div>

//               <div className="flex items-center gap-2 mt-3 text-slate-700">
//                 <MapPin size={18} />{" "}
//                 {isEditing ? (
//                   <input
//                     name="address"
//                     value={formData.address}
//                     onChange={handleInputChange}
//                     className="bg-white border border-blue-400 rounded px-2 py-1 flex-1 outline-none text-sm"
//                     placeholder="Full Address"
//                   />
//                 ) : (
//                   <span>{formData.address || "No address provided"}</span>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="bg-gray-200 p-6 rounded-lg shadow-lg w-full lg:w-[30%]">
//           <h2 className="text-xl font-semibold text-slate-900">Shop Details</h2>

//           <div className="flex items-center gap-3 mt-3 text-slate-700">
//             <Calendar size={18} />
//             <span>
//               Joined At: {new Date(shop?.createdAt!).toLocaleDateString()}
//             </span>
//           </div>

//           <div className="flex items-center gap-3 mt-3 text-slate-700">
//             <Globe size={18} />
//             {isEditing ? (
//               <input
//                 name="website"
//                 value={formData.website}
//                 onChange={handleInputChange}
//                 className="bg-white border border-blue-400 rounded px-2 py-1 flex-1 outline-none text-sm"
//                 placeholder="Website URL"
//               />
//             ) : (
//               shop?.website && (
//                 <Link
//                   href={formData.website}
//                   className="hover:underline text-blue-600"
//                 >
//                   {formData.website}
//                 </Link>
//               )
//             )}
//           </div>

//           {shop?.socialLinks && shop?.socialLinks.length > 0 && (
//             <div className="mt-3">
//               <h3 className="text-slate-700 text-lg font-medium">Follow Us:</h3>
//               <div className="flex gap-3 mt-2">
//                 {shop?.socialLinks?.map((link: any, index: number) => (
//                   <a
//                     key={index}
//                     href={link.url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="opacity-[.9]"
//                   >
//                     {link.type === "youtube" && <YoutubeIcon />}
//                     {link.type === "x" && <XIcon />}
//                   </a>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Tabs Section Remains Unchanged */}
//       <div className="w-[85%] lg:w-[70%] mx-auto mt-8">
//         <div className="flex border-b border-gray-300">
//           {TABS.map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`py-3 px-6 text-lg font-semibold ${activeTab === tab
//                 ? "text-slate-800 border-b-2 border-blue-600"
//                 : "text-slate-600"
//                 } transition`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         <div className="bg-gray-200 rounded-lg my-4 text-slate-700">
//           {activeTab === "Products" && (
//             <div className="m-auto grid grid-cols-1 p-4 sm:grid-cols-3 md:grid-cols-4">
//               {isLoading && (
//                 <>
//                   {Array.from({ length: 10 }).map((_, index) => (
//                     <div
//                       key={index}
//                       className="h-[250px] bg-gray-300 animate-pulse rounded-xl"
//                     ></div>
//                   ))}
//                 </>
//               )}
//               {products?.map((product: any) => (
//                 <ProductCard key={product.id} product={product} />
//               ))}
//               {products?.length === 0 && (
//                 <p className="py-2">No products available yet!</p>
//               )}
//             </div>
//           )}
//           {activeTab === "Offers" && (
//             <div className="m-auto grid grid-cols-1 p-4 sm:grid-cols-3 md:grid-cols-4">
//               {isEventsLoading && (
//                 <>
//                   {Array.from({ length: 10 }).map((_, index) => (
//                     <div
//                       key={index}
//                       className="h-[250px] bg-gray-300 animate-pulse rounded-xl"
//                     ></div>
//                   ))}
//                 </>
//               )}
//               {events?.map((product: any) => (
//                 <ProductCard
//                   isEvent={true}
//                   key={product.id}
//                   product={product}
//                 />
//               ))}
//               {events?.length === 0 && (
//                 <p className="py-2">No offers available yet!</p>
//               )}
//             </div>
//           )}
//           {activeTab === "Reviews" && (
//             <div>
//               <p className="text-center py-5">No Reviews available yet!</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SellerProfile;

"use client";

import { useQuery } from "@tanstack/react-query";
import useSeller from "apps/seller-ui/src/hooks/useSeller";
import ProductCard from "apps/seller-ui/src/shared/components/cards/product-card";
import axiosInstance from "apps/seller-ui/src/utils/axiosInstance";
import { Calendar, Clock, Globe, MapPin, Star, Users, XIcon, YoutubeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Page = () => {
  const { seller, isLoading: sellerLoading } = useSeller();
  const [activeTab, setActiveTab] = useState("Products");

  const sellerId = seller?.id;

  const TABS = ["Products", "Offers", "Reviews"];


  const { data: shop, isLoading: shopLoading } = useQuery({
    queryKey: ["shop-profile", sellerId],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/product/api/shop-profile/${sellerId}`
      );
      return res.data.shop;
    },
    enabled: !!sellerId, // 🔑 wait until sellerId exists
  });

  console.log("Profle", JSON.stringify(shop))
  if (sellerLoading || shopLoading) return <p>Loading...</p>;

  const products = shop?.products || [];
  // const reviews = shop?.reviews || [];
  const events = products.filter(
    (product: any) =>
      product.starting_date !== null &&
      product.ending_date !== null
  );


  const STATIC_REVIEWS = [
    {
      id: "r1",
      user: { name: "Amit Sharma" },
      rating: 5,
      comment: "Excellent product quality and very fast delivery!"
    },
    {
      id: "r2",
      user: { name: "Priya Verma" },
      rating: 4,
      comment: "Good value for money. Packaging was nice."
    },
    {
      id: "r3",
      user: { name: "Rahul Singh" },
      rating: 5,
      comment: "Highly recommended seller. Will buy again."
    }
  ];

  const reviews =
    shop?.reviews && shop.reviews.length > 0
      ? shop.reviews
      : STATIC_REVIEWS;

  return (
    <div>
      {/* Cover Banner */}
      <div className="relative w-full flex justify-center">
        <Image
          src={
            shop?.coverBanner ||
            "https://ik.imagekit.io/kamaleshsarkar/products/product-1758392401303_ngI1a_Fom.jpg"
          }
          alt="Seller Cover"
          className="w-full h-[400px] object-cover"
          width={1200}
          height={300}
        />
      </div>

      {/* Seller Info Section */}
      <div className="w-[85%] lg:w-[70%] mt-[-50px] mx-auto relative z-20 flex flex-col lg:flex-row gap-6">
        <div className="bg-gray-200 p-6 rounded-lg shadow-lg flex-1 relative">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            {/* Avatar */}
            <div className="relative w-[100px] h-[100px] rounded-full border-4 border-slate-300 overflow-hidden">
              <Image
                src={
                  shop?.avatar ||
                  "https://ik.imagekit.io/kamaleshsarkar/products/product-1758392410558_C5Yrijl2gR.jpg"
                }
                alt="Seller Avatar"
                fill
                className="object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 w-full">
              <h1 className="text-2xl font-semibold text-slate-900">
                {shop?.name || "No name available"}
              </h1>

              <p className="text-slate-800 text-sm mt-1">
                {shop?.bio || "No bio available"}
              </p>

              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center text-blue-400 gap-1">
                  <Star fill="#60a5fa" size={18} />
                  <span>{shop?.ratings ?? "N/A"}</span>
                </div>

                <div className="flex items-center text-slate-700 gap-1">
                  <Users size={18} />
                  <span>0 Followers</span>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-3 text-slate-700">
                <Clock size={18} />
                <span>{shop?.opening_hours || "Not specified"}</span>
              </div>

              <div className="flex items-center gap-2 mt-3 text-slate-700">
                <MapPin size={18} />
                <span>{shop?.address || "No address provided"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shop Details */}
        <div className="bg-gray-200 p-6 rounded-lg shadow-lg w-full lg:w-[30%]">
          <h2 className="text-xl font-semibold text-slate-900">Shop Details</h2>

          <div className="flex items-center gap-3 mt-3 text-slate-700">
            <Calendar size={18} />
            <span>
              Joined At:{" "}
              {shop?.createdAt
                ? new Date(shop.createdAt).toLocaleDateString()
                : "N/A"}
            </span>
          </div>

          {shop?.website && (
            <div className="flex items-center gap-3 mt-3 text-slate-700">
              <Globe size={18} />
              <Link
                href={shop.website}
                target="_blank"
                className="hover:underline text-blue-600"
              >
                {shop.website}
              </Link>
            </div>
          )}

          {shop?.socialLinks?.length > 0 && (
            <div className="mt-3">
              <h3 className="text-slate-700 text-lg font-medium">Follow Us</h3>
              <div className="flex gap-3 mt-2">
                {shop.socialLinks.map((link: any, index: number) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.type === "youtube" && <YoutubeIcon />}
                    {link.type === "x" && <XIcon />}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs Section (unchanged) */}
      <div className="w-[85%] lg:w-[70%] mx-auto mt-8">
        <div className="flex border-b border-gray-300">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-6 text-lg font-semibold ${activeTab === tab
                ? "text-slate-800 border-b-2 border-blue-600"
                : "text-slate-600"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-gray-200 rounded-lg my-4 text-slate-700">
          {activeTab === "Products" && (
            <div className="m-auto grid grid-cols-1 p-4 sm:grid-cols-3 md:grid-cols-4">
              {products?.length === 0 && (
                <p className="py-2">No products available yet!</p>
              )}
              {products?.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {activeTab === "Offers" && (
            <div className="m-auto grid grid-cols-1 p-4 sm:grid-cols-3 md:grid-cols-4">
              {events?.length === 0 && (
                <p className="py-2">No offers available yet!</p>
              )}
              {events?.map((product: any) => (
                <ProductCard isEvent key={product.id} product={product} />
              ))}
            </div>
          )}

          {activeTab === "Reviews" && (
            <div className="py-5">
              {reviews.length === 0 ? (
                <p className="text-center text-gray-500">
                  No reviews available yet!
                </p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review: any) => (
                    <div
                      key={review.id}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">{review.user?.name}</p>
                        <span className="text-yellow-500">
                          ⭐ {review.rating}
                        </span>
                      </div>

                      <p className="mt-2 text-gray-600">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>

  );
};

export default Page;
