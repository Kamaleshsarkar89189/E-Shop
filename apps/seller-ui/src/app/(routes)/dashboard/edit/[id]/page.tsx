'use client';

import { useQuery } from '@tanstack/react-query';
import ImagePlaceHolder from 'apps/seller-ui/src/shared/components/image-placeholder';
import { enhancements } from 'apps/seller-ui/src/utils/AI.enhancements';
import axiosInstance from 'apps/seller-ui/src/utils/axiosInstance';
import { ChevronRight, Wand, X } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import ColorSelector from 'packages/components/color-selector';
import CustomProperties from 'packages/components/custom-properties';
import CustomSpecifications from 'packages/components/custom-specifications';
import Input from 'packages/components/input';
import RichTextEditor from 'packages/components/rich-text-editor';
import SizeSelector from 'packages/components/size-selector';
import React, { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface UploadedImage {
  fileId: string;
  file_url: string;
}

type ProductFormValues = {
  title: string;
  short_description: string;
  tags: string;
  warranty: string;
  slug: string;
  brand?: string;
  category: string;
  subCategory: string;
  detailed_description: string;
  video_url?: string;
  regular_price: number;
  sale_price: number;
  stock: number;
  cash_on_delivery: 'yes' | 'no';
  colors?: string[];
  sizes?: string[];
  specifications?: any[];
  properties?: any[];
  discountCodes?: string[];
  images?: (UploadedImage | null)[];
};

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const productId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const {
    register,
    control,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    defaultValues: {
      cash_on_delivery: 'yes',
      images: [null],
    },
  });

  const [openImageModal, setOpenImageModal] = useState(false);
  const [activeEffect, setActiveEffect] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [pictureUploadingLoader, setPictureUploadingLoader] = useState(false);
  const [images, setImages] = useState<(UploadedImage | null)[]>([null]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['edit-product', productId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/product/api/get-product/${productId}`);
      console.log("API RESPONSE:", res.data);
      return res.data;
    },
    enabled: !!productId,
    retry: 2,
  });

  const { data: categoriesData, isLoading: categoriesLoading, isError: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axiosInstance.get('/product/api/get-categories');
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const { data: discountCodes = [], isLoading: discountLoading } = useQuery({
    queryKey: ['shop-discounts'],
    queryFn: async () => {
      const res = await axiosInstance.get('/product/api/get-discount-codes');
      return res?.data?.discount_codes || [];
    },
  });

  const categories = categoriesData?.categories || [];
  const subCategoriesData = categoriesData?.subCategories || {};

  const selectedCategory = watch('category');
  const regularPrice = watch('regular_price');

  const subCategories = useMemo(() => {
    return selectedCategory ? subCategoriesData[selectedCategory] || [] : [];
  }, [selectedCategory, subCategoriesData]);

  useEffect(() => {
    if (!data?.product) return;

    const product = data.product;

    const mappedImages: (UploadedImage | null)[] =
      product?.images?.length > 0
        ? product.images.map((img: any) => ({
          fileId: img.file_id,   // ✅ correct
          file_url: img.url,     // ✅ correct
        }))
        : [null];

    console.log("Mapped Images:", mappedImages);
    setImages(mappedImages);
    setValue("images", mappedImages);

    reset({
      title: product.title || '',
      short_description: product.short_description || '',
      tags: Array.isArray(product.tags) ? product.tags.join(',') : product.tags || '',
      warranty: product.warranty || '',
      slug: product.slug || '',
      brand: product.brand || '',
      category: product.category || '',
      subCategory: product.subCategory || '',
      detailed_description: product.detailed_description || '',
      video_url: product.video_url || '',
      regular_price: product.regular_price ?? 0,
      sale_price: product.sale_price ?? 0,
      stock: product.stock ?? 0,
      cash_on_delivery: product.cashOnDelivery || 'yes',
      colors: product.colors || [],
      sizes: product.sizes || [],
      specifications: product.specifications || [],
      properties: product.properties || [],
      discountCodes: product.discountCodes || [],
      images: mappedImages,
    });

    if (mappedImages[0]?.file_url) {
      setSelectedImage(mappedImages[0].file_url);
    }
  }, [data, reset]);

  const convertFileToBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = async (file: File | null, index: number) => {
    if (!file) return;

    setPictureUploadingLoader(true);

    try {
      const fileName = await convertFileToBase64(file);
      const response = await axiosInstance.post('/product/api/upload-product-image', {
        fileName,
      });

      const uploadedImage: UploadedImage = {
        fileId: response.data.fileId,
        file_url: response.data.file_url,
      };

      const updatedImages = [...images];
      updatedImages[index] = uploadedImage;

      if (index === images.length - 1 && updatedImages.length < 8) {
        updatedImages.push(null);
      }

      setImages(updatedImages);
      setValue('images', updatedImages);
    } catch (error) {
      console.log(error);
      toast.error('Image upload failed');
    } finally {
      setPictureUploadingLoader(false);
    }
  };

  const handleRemoveImage = async (index: number) => {
    try {
      const updatedImages = [...images];
      const imageToDelete = updatedImages[index];

      if (imageToDelete && typeof imageToDelete === 'object' && imageToDelete.fileId) {
        await axiosInstance.delete('/product/api/delete-product-image', {
          data: { fileId: imageToDelete.fileId },
        });
      }

      updatedImages.splice(index, 1);

      if (!updatedImages.includes(null) && updatedImages.length < 8) {
        updatedImages.push(null);
      }

      setImages(updatedImages);
      setValue('images', updatedImages);
    } catch (error) {
      console.log(error);
      toast.error('Failed to remove image');
    }
  };

  const applyTransformation = async (effect: string) => {
    if (!selectedImage || processing) return;

    setProcessing(true);
    setActiveEffect(effect);

    try {
      const url = new URL(selectedImage);
      url.searchParams.delete('tr');

      let safeEffect = effect;
      if (effect === 'e-upscale') {
        safeEffect = 'e-upscale,w-1200';
      }

      url.searchParams.set('tr', safeEffect);

      const transformedUrl = url.toString();
      const res = await fetch(transformedUrl, { method: 'HEAD' });

      if (res.ok) {
        setSelectedImage(transformedUrl);
      } else {
        setSelectedImage(selectedImage);
      }
    } catch (error) {
      console.error(error);
      setSelectedImage(selectedImage);
    } finally {
      setProcessing(false);
    }
  };

  const onSubmit = async (formData: ProductFormValues) => {
    try {
      setLoading(true);

      const payload = {
        ...formData,
        discountCodes: formData.discountCodes || [],
        images: images.filter(Boolean),
      };

      await axiosInstance.put(`/product/api/update-product/${productId}`, payload);

      toast.success('Product updated successfully');
      router.push('/dashboard/all-products');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      setLoading(true);
      const formData = watch();
      await axiosInstance.put(`/product/api/update-product/${productId}`, {
        ...formData,
        status: 'draft',
        images: images.filter(Boolean),
      });

      toast.success('Draft saved');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to save draft');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || categoriesLoading) {
    return <p className="p-6 text-white">Loading product...</p>;
  }

  if (isError || categoriesError) {
    return <p className="p-6 text-red-500">Failed to load product data</p>;
  }

  return (
    <form
      className="w-full mx-auto p-8 shadow-md rounded-lg text-white"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-2xl py-2 font-semibold font-Poppins text-white">
        Edit Product
      </h2>

      <div className="flex items-center">
        <span className="text-[#80DeeA] cursor-pointer" onClick={() => router.push('/dashboard')}>
          Dashboard
        </span>
        <ChevronRight size={20} className="opacity-[.8]" />
        <span>Edit Product</span>
      </div>

      <div className="py-4 w-full flex gap-6">
        <div className="md:w-[35%]">
          {images?.length > 0 && (
            <ImagePlaceHolder
              setOpenImageModal={setOpenImageModal}
              size="765 X 850"
              small={false}
              images={images}
              pictureUploadingLoader={pictureUploadingLoader}
              index={0}
              onImageChange={handleImageChange}
              setSelectedImage={setSelectedImage}
              onRemove={handleRemoveImage}
            />
          )}

          {/* <div className="grid grid-cols-2 gap-3 mt-4">
            {images.slice(1).map((_, index) => (
              <ImagePlaceHolder
                key={index}
                setOpenImageModal={setOpenImageModal}
                size="765 X 850"
                pictureUploadingLoader={pictureUploadingLoader}
                images={images}
                small
                setSelectedImage={setSelectedImage}
                index={index + 1}
                onImageChange={handleImageChange}
                onRemove={handleRemoveImage}
              />
            ))}
          </div> */}

          <div className="grid grid-cols-2 gap-3 mt-4">
            {/* ✅ Show ONLY existing images (excluding index 0 already shown above) */}
            {images
              .slice(1)
              .filter((img) => img?.file_url) // only filled images
              .map((_, index) => (
                <ImagePlaceHolder
                  key={index}
                  setOpenImageModal={setOpenImageModal}
                  size="765 X 850"
                  pictureUploadingLoader={pictureUploadingLoader}
                  images={images}
                  small
                  setSelectedImage={setSelectedImage}
                  index={index + 1}
                  onImageChange={handleImageChange}
                  onRemove={handleRemoveImage}
                />
              ))}

            {/* ✅ SHOW ONLY ONE upload box at the END */}
            {images.length < 8 && (
              <ImagePlaceHolder
                key="upload-new"
                setOpenImageModal={setOpenImageModal}
                size="765 X 850"
                pictureUploadingLoader={pictureUploadingLoader}
                images={images}
                small
                setSelectedImage={setSelectedImage}
                index={images.findIndex((img) => !img) !== -1
                  ? images.findIndex((img) => !img)
                  : images.length}
                onImageChange={handleImageChange}
                onRemove={handleRemoveImage}
              />
            )}
          </div>
        </div>

        <div className="md:w-[65%]">
          <div className="w-full flex gap-6">
            <div className="w-2/4">
              <Input
                label="Product Title *"
                placeholder="Enter product title"
                {...register('title', { required: 'Title is required' })}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message as string}
                </p>
              )}

              <div className="mt-2">
                <Input
                  type="textarea"
                  rows={7}
                  cols={10}
                  label="Short Description * (Max 150 words)"
                  placeholder="Enter product description for quick view"
                  {...register('short_description', {
                    required: 'Description is required',
                    validate: (value) => {
                      const wordCount = value.trim().split(/\s+/).length;
                      return (
                        wordCount <= 150 ||
                        `Description cannot exceed 150 words (Current: ${wordCount})`
                      );
                    },
                  })}
                />
                {errors.short_description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.short_description.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <Input
                  label="Tags *"
                  placeholder="apple,flagship"
                  {...register('tags', {
                    required: 'Separate related product tags with commas',
                  })}
                />
                {errors.tags && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.tags.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <Input
                  label="Warranty *"
                  placeholder="1 Year / No Warranty"
                  {...register('warranty', {
                    required: 'Warranty is required!',
                  })}
                />
                {errors.warranty && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.warranty.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <Input
                  label="Slug *"
                  placeholder="product_slug"
                  {...register('slug', {
                    required: 'Slug is required!',
                    pattern: {
                      value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                      message: 'Invalid slug format! Use only lowercase letters, numbers, and hyphens.',
                    },
                    minLength: {
                      value: 3,
                      message: 'Slug must be at least 3 characters long.',
                    },
                    maxLength: {
                      value: 50,
                      message: 'Slug cannot be longer than 50 characters.',
                    },
                  })}
                />
                {errors.slug && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.slug.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <Input label="Brand" placeholder="Apple" {...register('brand')} />
              </div>

              <div className="mt-2">
                <ColorSelector control={control} errors={errors} />
              </div>

              <div className="mt-2">
                <CustomSpecifications control={control} errors={errors} />
              </div>

              <div className="mt-2">
                <CustomProperties control={control} errors={errors} />
              </div>

              <div className="mt-2">
                <label className="block font-semibold text-gray-300 mb-1">
                  Cash On Delivery *
                </label>
                <select
                  {...register('cash_on_delivery', {
                    required: 'Cash on Delivery is required',
                  })}
                  className="w-full border outline-none border-gray-700 bg-transparent"
                >
                  <option value="yes" className="bg-black">Yes</option>
                  <option value="no" className="bg-black">No</option>
                </select>
                {errors.cash_on_delivery && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.cash_on_delivery.message as string}
                  </p>
                )}
              </div>
            </div>

            <div className="w-2/4">
              <label className="block font-semibold text-gray-300 mb-1">
                Category *
              </label>
              <Controller
                name="category"
                control={control}
                rules={{ required: 'Category is required' }}
                render={({ field }) => (
                  <select {...field} className="w-full border outline-none border-gray-700 bg-transparent">
                    <option value="" className="bg-black">Select Category</option>
                    {categories.map((category: string) => (
                      <option value={category} key={category} className="bg-black">
                        {category}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.category && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.category.message as string}
                </p>
              )}

              <div className="mt-2">
                <label className="block font-semibold text-gray-300 mb-1">
                  Subcategory *
                </label>
                <Controller
                  name="subCategory"
                  control={control}
                  rules={{ required: 'Subcategory is required' }}
                  render={({ field }) => (
                    <select {...field} className="w-full border outline-none border-gray-700 bg-transparent">
                      <option value="" className="bg-black">Select Subcategory</option>
                      {subCategories.map((subCategory: string) => (
                        <option value={subCategory} key={subCategory} className="bg-black">
                          {subCategory}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.subCategory && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.subCategory.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <label className="block font-semibold text-gray-300 mb-1">
                  Detailed Description * (Min 100 words)
                </label>
                <Controller
                  name="detailed_description"
                  control={control}
                  rules={{
                    required: 'Detailed description is required!',
                    validate: (value) => {
                      const wordCount = value
                        ?.split(/\s+/)
                        .filter((word: string) => word).length;
                      return wordCount >= 100 || 'Description must be at least 100 words!';
                    },
                  }}
                  render={({ field }) => (
                    <RichTextEditor value={field.value || ""} onChange={field.onChange} />
                  )}
                />
                {errors.detailed_description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.detailed_description.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <Input
                  label="Video URL"
                  placeholder="https://www.youtube.com/embed/xyz123"
                  {...register('video_url', {
                    pattern: {
                      value: /^https:\/\/www\.(www\.)?youtube\.com\/embed\/[a-zA-Z0-9_-]+$/,
                      message: 'Invalid YouTube embed URL.',
                    },
                  })}
                />
                {errors.video_url && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.video_url.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <Input
                  label="Regular Price"
                  placeholder="20$"
                  {...register('regular_price', {
                    valueAsNumber: true,
                    min: { value: 1, message: 'Price must be at least 1' },
                    validate: (value) => !isNaN(value) || 'Only numbers are allowed',
                  })}
                />
                {errors.regular_price && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.regular_price.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <Input
                  label="Sale Price *"
                  placeholder="15$"
                  {...register('sale_price', {
                    required: 'Sale Price is required',
                    valueAsNumber: true,
                    min: { value: 1, message: 'Sale Price must be at least 1' },
                    validate: (value) => {
                      if (isNaN(value)) return 'Only numbers are allowed';
                      if (regularPrice && value >= regularPrice) {
                        return 'Sale Price must be less than Regular Price';
                      }
                      return true;
                    },
                  })}
                />
                {errors.sale_price && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.sale_price.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <Input
                  label="Stock *"
                  placeholder="100"
                  {...register('stock', {
                    required: 'Stock is required!',
                    valueAsNumber: true,
                    min: { value: 1, message: 'Stock must be at least 1' },
                    max: { value: 1000, message: 'Stock cannot exceed 1,000' },
                    validate: (value) => {
                      if (isNaN(value)) return 'Only numbers are allowed!';
                      if (!Number.isInteger(value)) return 'Stock must be a whole number!';
                      return true;
                    },
                  })}
                />
                {errors.stock && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.stock.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <SizeSelector control={control} errors={errors} />
              </div>

              <div className="mt-3">
                <label className="block font-semibold text-gray-300 mb-1">
                  Select Discount Codes (optional)
                </label>
                {discountLoading ? (
                  <p className="text-gray-400">Loading discount codes ...</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {discountCodes?.map((code: any) => (
                      <button
                        key={code.id}
                        type="button"
                        className={`px-3 py-1 rounded-md text-sm font-semibold border ${watch('discountCodes')?.includes(code.id)
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700'
                          }`}
                        onClick={() => {
                          const currentSelection = watch('discountCodes') || [];
                          const updatedSelection = currentSelection.includes(code.id)
                            ? currentSelection.filter((id: string) => id !== code.id)
                            : [...currentSelection, code.id];

                          setValue('discountCodes', updatedSelection);
                        }}
                      >
                        {code?.public_name} ({code.discountValue}
                        {code.discountType === 'percentage' ? '%' : '$'})
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {openImageModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-[450px] text-white">
            <div className="flex justify-between items-center pb-3 mb-4">
              <h2 className="text-lg font-semibold">Enhance Product Image</h2>
              <X
                size={20}
                className="cursor-pointer"
                onClick={() => setOpenImageModal(false)}
              />
            </div>

            <div className="relative w-full h-[250px] rounded-md overflow-hidden border border-gray-600">
              {selectedImage ? (
                <Image src={selectedImage} alt="product-image" fill />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No image selected
                </div>
              )}
            </div>

            {selectedImage && (
              <div className="mt-4 space-y-2">
                <h3 className="text-white text-sm font-semibold">AI Enhancements</h3>
                <div className="grid grid-cols-2 gap-3 max-h-[250px] overflow-y-auto">
                  {enhancements?.map(({ label, effect }) => (
                    <button
                      key={effect}
                      type="button"
                      className={`p-2 rounded-md flex items-center gap-2 ${activeEffect === effect
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                      onClick={() => applyTransformation(effect)}
                      disabled={processing}
                    >
                      <Wand size={18} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={handleSaveDraft}
          className="px-4 py-2 bg-gray-700 text-white rounded-md"
        >
          Save Draft
        </button>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Product'}
        </button>
      </div>
    </form>
  );
};

export default Page;