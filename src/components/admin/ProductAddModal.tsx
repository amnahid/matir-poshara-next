"use client";

import React, { useState } from "react";
import { X, Loader2, Package, Tag, Info, DollarSign, Image as ImageIcon, Star } from "lucide-react";

interface ProductAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const categories = [
  "রান্নাঘরের পণ্য",
  "ঘর সাজানো",
  "বাগানের পণ্য",
  "আলোকসজ্জা",
  "উপহারের সামগ্রী",
  "ঐতিহ্যবাহী সংগ্রহ",
];

const ProductAddModal: React.FC<ProductAddModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: categories[0],
    badge: "",
    icon: "🏺",
    isBestSelling: false,
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
          badge: formData.badge || null,
        }),
      });

      if (res.ok) {
        onSuccess();
        onClose();
        setFormData({
          name: "",
          description: "",
          price: "",
          originalPrice: "",
          category: categories[0],
          badge: "",
          icon: "🏺",
          isBestSelling: false,
        });
      } else {
        alert("পণ্য যোগ করতে সমস্যা হয়েছে।");
      }
    } catch (error) {
      console.error("Failed to add product:", error);
      alert("সার্ভারে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-text-dark/55 z-[9999] backdrop-blur-[3px] flex items-center justify-center p-4">
      <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-br from-terracotta to-clay p-6 flex items-center justify-between">
          <h2 className="font-tiro text-2xl text-white flex items-center gap-2">
            <Package size={24} /> নতুন পণ্য যোগ করুন
          </h2>
          <button 
            onClick={onClose}
            className="bg-white/20 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-6">
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

          <div className="flex items-center gap-3 bg-cream/50 p-4 rounded-xl border border-cream-dark">
            <input 
              type="checkbox"
              id="isBestSelling"
              name="isBestSelling"
              checked={formData.isBestSelling}
              onChange={handleChange}
              className="w-5 h-5 accent-terracotta rounded"
            />
            <label htmlFor="isBestSelling" className="text-sm font-semibold text-text-dark cursor-pointer">
              সর্বাধিক বিক্রিত (Best Selling) হিসেবে দেখান
            </label>
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
              disabled={loading}
              className="flex-1 bg-terracotta text-white py-4 rounded-xl font-bold hover:bg-clay transition-all shadow-lg shadow-terracotta/25 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : "পণ্য যোগ করুন"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductAddModal;
