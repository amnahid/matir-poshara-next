"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Heart, Package, ShoppingCart, User as UserIcon, LogOut, ChevronDown } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useSession, signOut } from "next-auth/react";

const Header = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { totalItems, setIsCartOpen, setIsTrackingOpen } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      {/* TOP BAR */}
      <div className="bg-earth text-[#F5DEB3] text-xs py-1.5 text-center tracking-wide">
        🎉 বিশেষ অফার: ৫০০ টাকার বেশি কেনাকাটায় ফ্রি শিপিং! | হটলাইন: 01700-000000 | সকাল ৯টা - রাত ১০টা
      </div>

      {/* HEADER */}
      <header className="bg-white shadow-clay sticky top-0 z-[1000]">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-12 h-12 bg-gradient-to-br from-terracotta to-clay rounded-full flex items-center justify-center text-2xl shadow-clay transition-transform group-hover:scale-105">
              🏺
            </div>
            <div className="logo-text">
              <h1 className="font-tiro text-xl text-clay leading-tight">মাটির পশরা</h1>
              <p className="text-[10px] text-text-light font-normal">ঐতিহ্যের ছোঁয়ায় মাটির সৃষ্টি</p>
            </div>
          </Link>

          <div className="flex-1 flex items-center bg-cream border-1.5 border-cream-dark rounded-lg overflow-hidden transition-colors focus-within:border-terracotta">
            <input
              type="text"
              placeholder="মাটির পণ্য খুঁজুন... হাড়ি, ফুলদানি, শোপিস..."
              className="flex-1 bg-transparent px-4 py-2 text-sm text-text-dark outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button 
              onClick={handleSearch}
              className="bg-terracotta px-4.5 py-2 text-white hover:bg-earth transition-colors"
            >
              <Search size={18} />
            </button>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {session ? (
              <div className="relative">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 bg-cream-dark/30 px-3 py-2 rounded-xl hover:bg-cream-dark/50 transition-all border border-cream-dark"
                >
                  <div className="w-8 h-8 bg-terracotta text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {session.user?.name?.charAt(0)}
                  </div>
                  <div className="flex flex-col items-start mr-1">
                    <span className="text-[10px] text-text-light uppercase tracking-tighter leading-none mb-1">স্বাগতম,</span>
                    <span className="text-[13px] font-bold text-text-dark leading-none">{session.user?.name?.split(" ")[0]}</span>
                  </div>
                  <ChevronDown size={14} className={`text-text-mid transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-cream-dark py-2 z-[1001] animate-in fade-in slide-in-from-top-2">
                    <Link 
                      href="/profile" 
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-mid hover:bg-cream hover:text-terracotta transition-all"
                    >
                      <UserIcon size={16} /> প্রোফাইল
                    </Link>
                    <Link 
                      href="/profile/orders" 
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-mid hover:bg-cream hover:text-terracotta transition-all"
                    >
                      <Package size={16} /> আমার অর্ডার
                    </Link>
                    <Link 
                      href="/profile/wishlist" 
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-mid hover:bg-cream hover:text-terracotta transition-all"
                    >
                      <Heart size={16} /> উইশলিস্ট
                    </Link>
                    <hr className="my-2 border-cream-dark" />
                    <button 
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        signOut();
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-all w-full"
                    >
                      <LogOut size={16} /> লগআউট
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link 
                  href="/login"
                  className="bg-transparent border-1.5 border-clay text-clay px-4 py-1.5 rounded-md text-sm font-medium hover:bg-clay hover:text-white transition-all"
                >
                  লগইন
                </Link>
                <Link 
                  href="/register"
                  className="bg-terracotta text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-earth transition-all"
                >
                  রেজিস্ট্রেশন
                </Link>
              </div>
            )}
            
            <div className="flex items-center gap-1 ml-2">
              <button className="flex flex-col items-center gap-0.5 p-1.5 text-text-mid hover:bg-cream-dark hover:text-terracotta rounded-lg transition-all">
                <Heart size={20} />
                <span className="text-[10px]">পছন্দ</span>
              </button>
              
              <button 
                onClick={() => setIsTrackingOpen(true)}
                className="flex flex-col items-center gap-0.5 p-1.5 text-text-mid hover:bg-cream-dark hover:text-terracotta rounded-lg transition-all"
              >
                <Package size={20} />
                <span className="text-[10px]">ট্র্যাকিং</span>
              </button>
              
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative flex flex-col items-center gap-0.5 p-1.5 text-text-mid hover:bg-cream-dark hover:text-terracotta rounded-lg transition-all"
              >
                <ShoppingCart size={20} />
                <span className="text-[10px]">কার্ট</span>
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 bg-terracotta text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
