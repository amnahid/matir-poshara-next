"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2, User, MapPin, Award, Info, Save } from "lucide-react";

interface Artisan {
  _id: string;
  name: string;
  village: string;
  experience: string;
  story: string;
  image?: string;
}

interface ArtisanFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  artisan?: Artisan | null;
}

const ArtisanFormModal: React.FC<ArtisanFormModalProps> = ({ isOpen, onClose, onSuccess, artisan }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    village: "",
    experience: "",
    story: "",
  });

  useEffect(() => {
    if (artisan) {
      setTimeout(() => {
        setFormData({
          name: artisan.name,
          village: artisan.village,
          experience: artisan.experience,
          story: artisan.story,
        });
      }, 0);
    } else {
      setTimeout(() => {
        setFormData({
          name: "",
          village: "",
          experience: "",
          story: "",
        });
      }, 0);
    }
  }, [artisan, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = artisan ? "PATCH" : "POST";
      const body = {
        ...formData,
        ...(artisan ? { id: artisan._id } : {})
      };

      const res = await fetch("/api/admin/artisans", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        alert(artisan ? "কারিগর আপডেট করতে সমস্যা হয়েছে।" : "কারিগর যোগ করতে সমস্যা হয়েছে।");
      }
    } catch (error) {
      console.error("Failed to save artisan:", error);
      alert("সার্ভারে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-text-dark/55 z-[9999] backdrop-blur-[3px] flex items-center justify-center p-4">
      <div className="bg-white rounded-[32px] w-full max-w-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-br from-terracotta to-clay p-6 flex items-center justify-between">
          <h2 className="font-tiro text-2xl text-white flex items-center gap-2">
            <User size={24} /> {artisan ? "কারিগর এডিট করুন" : "নতুন কারিগর যোগ করুন"}
          </h2>
          <button 
            onClick={onClose}
            className="bg-white/20 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-mid flex items-center gap-2">
              <User size={14} className="text-clay" /> কারিগরের নাম
            </label>
            <input 
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="যেমন: রহিম মৃধা"
              className="w-full bg-cream border border-cream-dark rounded-xl px-4 py-3 outline-none focus:border-terracotta transition-colors text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-mid flex items-center gap-2">
                <MapPin size={14} className="text-clay" /> ঠিকানা
              </label>
              <input 
                required
                name="village"
                value={formData.village}
                onChange={handleChange}
                placeholder="যেমন: ধামরাই, ঢাকা"
                className="w-full bg-cream border border-cream-dark rounded-xl px-4 py-3 outline-none focus:border-terracotta transition-colors text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-mid flex items-center gap-2">
                <Award size={14} className="text-clay" /> অভিজ্ঞতা
              </label>
              <input 
                required
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="যেমন: ২৫ বছরের অভিজ্ঞতা"
                className="w-full bg-cream border border-cream-dark rounded-xl px-4 py-3 outline-none focus:border-terracotta transition-colors text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-mid flex items-center gap-2">
              <Info size={14} className="text-clay" /> কারিগরের গল্প
            </label>
            <textarea 
              required
              name="story"
              value={formData.story}
              onChange={handleChange}
              rows={4}
              placeholder="কারিগরের ব্যক্তিগত গল্প ও কাজের বিবরণ লিখুন..."
              className="w-full bg-cream border border-cream-dark rounded-xl px-4 py-3 outline-none focus:border-terracotta transition-colors text-sm resize-none"
            ></textarea>
          </div>

          <div className="pt-4 flex gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 bg-white text-text-mid border border-cream-dark py-4 rounded-xl font-bold hover:bg-cream transition-all"
            >
              বাতil করুন
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 bg-terracotta text-white py-4 rounded-xl font-bold hover:bg-clay transition-all shadow-lg shadow-terracotta/25 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> {artisan ? "আপডেট করুন" : "যোগ করুন"}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArtisanFormModal;
