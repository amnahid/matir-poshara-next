"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { X, Loader2, Package, Tag, Info, DollarSign, Image as ImageIcon, Star, Upload, User } from "lucide-react";
import { upload } from "@vercel/blob/client";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  badge?: "new" | "sale" | "hot";
  icon?: string;
  images: string[];
  isBestSelling: boolean;
  artisan?: string;
}

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: Product | null;
}

const categories = [
  "রান্নাঘরের পণ্য",
  "ঘর সাজানো",
  "বাগানের পণ্য",
  "আলোকসজ্জা",
  "উপহারের সামগ্রী",
  "ঐতিহ্যবাহী সংগ্রহ",
];

const ProductFormModal: React.FC<ProductFormModalProps> = ({ isOpen, onClose, onSuccess, product }) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [artisans, setArtisans] = useState<{name: string}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: categories[0],
    badge: "" as "new" | "sale" | "hot" | "",
    icon: "🏺",
    isBestSelling: false,
    artisan: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      originalPrice: "",
      category: categories[0],
      badge: "" as "new" | "sale" | "hot" | "",
      icon: "🏺",
      isBestSelling: false,
      artisan: "",
    });
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        const res = await fetch("/api/admin/artisans");
        const data = await res.json();
        setArtisans(data.artisans || []);
      } catch (error) {
        console.error("Failed to fetch artisans:", error);
      }
    };
    if (isOpen) fetchArtisans();
  }, [isOpen]);

  useEffect(() => {
    if (product) {
      setTimeout(() => {
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          originalPrice: product.originalPrice?.toString() || "",
          category: product.category,
          badge: product.badge || "",
          icon: product.icon || "🏺",
          isBestSelling: product.isBestSelling,
          artisan: product.artisan || "",
        });
        setImagePreview(product.images && product.images.length > 0 ? product.images[0] : null);
      }, 0);
    } else {
      setTimeout(() => resetForm(), 0);
    }
  }, [product, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = product?.images && product.images.length > 0 ? product.images[0] : "";

      if (imageFile) {
        setUploading(true);
        const blob = await upload(imageFile.name, imageFile, {
          access: 'public',
          handleUploadUrl: '/api/upload',
        });
        imageUrl = blob.url;
        setUploading(false);
      }

      const method = product ? "PATCH" : "POST";
      const body = {
        ...formData,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        badge: formData.badge || null,
        images: imageUrl ? [imageUrl] : [],
        image: imageUrl || undefined,
        ...(product ? { id: product._id } : {})
      };

      const res = await fetch("/api/admin/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        onSuccess();
        onClose();
        resetForm();
      } else {
        alert(product ? "পণ্য আপডেট করতে সমস্যা হয়েছে।" : "পণ্য যোগ করতে সমস্যা হয়েছে।");
      }
    } catch (error) {
      console.error("Failed to save product:", error);
      alert("সার্ভারে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-text-dark/55 z-[9999] backdrop-blur-[3px] flex items-center justify-center p-4">
      <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
        <div className="bg-gradient-to-br from-terracotta to-clay p-6 flex items-center justify-between">
          <h2 className="font-tiro text-2xl text-white flex items-center gap-2">
            <Package size={24} /> {product ? "পণ্য এডিট করুন" : "নতুন পণ্য যোগ করুন"}
          </h2>
          <button 
            onClick={onClose}
            className="bg-white/20 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-6">
          {/* Image Upload Section */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-mid flex items-center gap-2">
              <ImageIcon size={14} className="text-clay" /> পণ্যের ছবি
            </label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-[16/9] bg-cream border-2 border-dashed border-cream-dark rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-cream-dark/20 transition-all overflow-hidden relative group"
            >
              {imagePreview ? (
                <>
                  <Image 
                    src={imagePreview} 
                    alt="Preview" 
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm font-bold flex items-center gap-2">
                      <Upload size={16} /> ছবি পরিবর্তন করুন
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 text-text-light">
                  <Upload size={32} />
                  <p className="text-xs font-medium">ক্লিক করে ছবি আপলোড করুন</p>
                </div>
              )}
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-mid flex items-center gap-2">
                <Tag size={14} className="text-clay" /> পণ্যের নাম
              </label>
              <input 
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="যেমন: মাটির চা সেট"
                className="w-full bg-cream border border-cream-dark rounded-xl px-4 py-3 outline-none focus:border-terracotta transition-colors text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-mid flex items-center gap-2">
                <Package size={14} className="text-clay" /> ক্যাটাগরি
              </label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-cream border border-cream-dark rounded-xl px-4 py-3 outline-none focus:border-terracotta transition-colors text-sm appearance-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-mid flex items-center gap-2">
              <Info size={14} className="text-clay" /> বর্ণনা
            </label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="পণ্যের বিস্তারিত বর্ণনা লিখুন..."
              className="w-full bg-cream border border-cream-dark rounded-xl px-4 py-3 outline-none focus:border-terracotta transition-colors text-sm resize-none"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-mid flex items-center gap-2">
                <User size={14} className="text-clay" /> কারিগর
              </label>
              <select 
                name="artisan"
                value={formData.artisan}
                onChange={handleChange}
                className="w-full bg-cream border border-cream-dark rounded-xl px-4 py-3 outline-none focus:border-terracotta transition-colors text-sm appearance-none"
              >
                <option value="">কারিগর নির্বাচন করুন</option>
                {artisans.map(art => (
                  <option key={art.name} value={art.name}>{art.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-mid flex items-center gap-2">
                <ImageIcon size={14} className="text-clay" /> আইকন/ইমোজি
              </label>
              <input 
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                placeholder="যেমন: 🏺, 🫖, 🐴"
                className="w-full bg-cream border border-cream-dark rounded-xl px-4 py-3 outline-none focus:border-terracotta transition-colors text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-mid flex items-center gap-2">
                <DollarSign size={14} className="text-clay" /> বর্তমান মূল্য (৳)
              </label>
              <input 
                required
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="যেমন: ৫০০"
                className="w-full bg-cream border border-cream-dark rounded-xl px-4 py-3 outline-none focus:border-terracotta transition-colors text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-mid flex items-center gap-2">
                <DollarSign size={14} className="text-clay" /> আগের মূল্য (৳ - অপশনাল)
              </label>
              <input 
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                placeholder="যেমন: ৭০০"
                className="w-full bg-cream border border-cream-dark rounded-xl px-4 py-3 outline-none focus:border-terracotta transition-colors text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-mid flex items-center gap-2">
                <Star size={14} className="text-clay" /> ব্যাজ (অপশনাল)
              </label>
              <select 
                name="badge"
                value={formData.badge}
                onChange={handleChange}
                className="w-full bg-cream border border-cream-dark rounded-xl px-4 py-3 outline-none focus:border-terracotta transition-colors text-sm appearance-none"
              >
                <option value="">কোনোটিই নয়</option>
                <option value="new">নতুন (New)</option>
                <option value="sale">অফার (Sale)</option>
                <option value="hot">হট (Hot)</option>
              </select>
            </div>

            <div className="flex items-center gap-3 bg-cream/50 p-4 rounded-xl border border-cream-dark mt-auto">
              <input 
                type="checkbox"
                id="isBestSelling"
                name="isBestSelling"
                checked={formData.isBestSelling}
                onChange={handleChange}
                className="w-5 h-5 accent-terracotta rounded"
              />
              <label htmlFor="isBestSelling" className="text-sm font-semibold text-text-dark cursor-pointer">
                সর্বাধিক বিক্রিত হিসেবে দেখান
              </label>
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 bg-white text-text-mid border border-cream-dark py-4 rounded-xl font-bold hover:bg-cream transition-all"
            >
              বাতিল করুন
            </button>
            <button 
              type="submit"
              disabled={loading || uploading}
              className="flex-1 bg-terracotta text-white py-4 rounded-xl font-bold hover:bg-clay transition-all shadow-lg shadow-terracotta/25 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : (uploading ? "ছবি আপলোড হচ্ছে..." : (product ? "তথ্য আপডেট করুন" : "পণ্য যোগ করুন"))}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
