"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User, Phone, MapPin, Loader2, Save } from "lucide-react";

const ProfilePage = () => {
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/user/profile");
      const data = await res.json();
      if (data.user) {
        setFormData({
          name: data.user.name || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          address: data.user.address || "",
        });
      }
    } catch {
      console.error("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      setTimeout(() => fetchProfile(), 0);
    }
  }, [status, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "প্রোফাইল সফলভাবে আপডেট করা হয়েছে।" });
      } else {
        setMessage({ type: "error", text: "আপডেট করতে সমস্যা হয়েছে।" });
      }
    } catch {
      setMessage({ type: "error", text: "সার্ভারে সমস্যা হয়েছে।" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <Loader2 className="animate-spin text-terracotta" size={40} />
        <p className="text-sm text-text-mid font-medium">লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-tiro text-2xl text-text-dark mb-2">প্রোফাইল তথ্য</h2>
      <p className="text-text-light text-sm mb-8">আপনার ব্যক্তিগত তথ্য এবং ডেলিভারি ঠিকানা এখান থেকে আপডেট করুন</p>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-mid flex items-center gap-2">
            <User size={14} className="text-clay" /> নাম
          </label>
          <input 
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-cream border border-cream-dark rounded-xl px-4 py-3 outline-none focus:border-terracotta transition-colors text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-mid flex items-center gap-2">
            <User size={14} className="text-clay" /> ইমেইল
          </label>
          <input 
            name="email"
            type="email"
            disabled
            value={formData.email}
            className="w-full bg-cream border border-cream-dark rounded-xl px-4 py-3 outline-none opacity-60 cursor-not-allowed text-sm"
          />
          <p className="text-[10px] text-text-light">ইমেইল পরিবর্তন করা সম্ভব নয়</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-mid flex items-center gap-2">
            <Phone size={14} className="text-clay" /> ফোন নম্বর
          </label>
          <input 
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="01700-000000"
            className="w-full bg-cream border border-cream-dark rounded-xl px-4 py-3 outline-none focus:border-terracotta transition-colors text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-mid flex items-center gap-2">
            <MapPin size={14} className="text-clay" /> ডেলিভারি ঠিকানা
          </label>
          <textarea 
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            placeholder="আপনার বিস্তারিত ঠিকানা লিখুন..."
            className="w-full bg-cream border border-cream-dark rounded-xl px-4 py-3 outline-none focus:border-terracotta transition-colors text-sm resize-none"
          ></textarea>
        </div>

        {message.text && (
          <p className={`text-xs font-medium ${message.type === "success" ? "text-leaf" : "text-red-500"}`}>
            {message.text}
          </p>
        )}

        <button 
          type="submit"
          disabled={saving}
          className="bg-terracotta text-white px-8 py-3.5 rounded-xl font-bold hover:bg-clay transition-all shadow-lg shadow-terracotta/25 flex items-center justify-center gap-2 min-w-[180px]"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18} /> তথ্য সংরক্ষণ করুন</>}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
