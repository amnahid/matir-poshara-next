"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Loader2, Mail } from "lucide-react";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("ভুল ইমেইল অথবা পাসওয়ার্ড। আবার চেষ্টা করুন।");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("লগইন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-terracotta to-clay rounded-2xl flex items-center justify-center text-3xl shadow-xl mx-auto text-white">
              🏺
            </div>
          </Link>
          <h1 className="font-tiro text-3xl text-text-dark">লগইন করুন</h1>
          <p className="text-sm text-text-light mt-2">আপনার একাউন্টে প্রবেশ করতে তথ্য দিন</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-clay/10 border border-cream-dark">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-mid flex items-center gap-2">
                <Mail size={14} className="text-clay" /> ইমেইল
              </label>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                className="w-full bg-cream border border-cream-dark rounded-xl px-4 py-3 outline-none focus:border-terracotta transition-colors text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-mid flex items-center gap-2">
                <Lock size={14} className="text-clay" /> পাসওয়ার্ড
              </label>
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-cream border border-cream-dark rounded-xl px-4 py-3 outline-none focus:border-terracotta transition-colors text-sm"
              />
            </div>

            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-terracotta text-white py-4 rounded-xl font-bold hover:bg-clay transition-all shadow-lg shadow-terracotta/25 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "লগইন করুন"}
            </button>
          </form>
          
          <div className="mt-8 text-center text-sm">
            <span className="text-text-light">একাউন্ট নেই? </span>
            <Link href="/register" className="text-terracotta font-bold hover:underline">
              রেজিস্ট্রেশন করুন
            </Link>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/" className="text-xs text-text-light hover:text-terracotta transition-colors">
            ← মূল সাইটে ফিরে যান
          </Link>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
