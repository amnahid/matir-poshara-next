"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Heart, ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  icon?: string;
  category: string;
}

const WishlistPage = () => {
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const res = await fetch("/api/user/wishlist");
      const data = await res.json();
      if (data.wishlist) {
        setWishlist(data.wishlist);
      }
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => fetchWishlist(), 0);
  }, []);

  const removeFromWishlist = async (productId: string) => {
    try {
      const res = await fetch(`/api/user/wishlist?productId=${productId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setWishlist(prev => prev.filter(p => p._id !== productId));
      }
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
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
      <h2 className="font-tiro text-2xl text-text-dark mb-2">উইশলিস্ট</h2>
      <p className="text-text-light text-sm mb-8">আপনার পছন্দ করা পণ্যসমূহের তালিকা</p>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 bg-cream/30 rounded-3xl border-2 border-dashed border-cream-dark">
          <Heart size={48} className="text-cream-dark mx-auto mb-4" />
          <h3 className="font-tiro text-lg text-text-dark mb-2">উইশলিস্ট খালি</h3>
          <p className="text-sm text-text-light max-w-xs mx-auto">আপনার পছন্দের পণ্যগুলো এখানে জমা রাখতে পণ্যের ওপর থাকা হার্ট আইকনে ক্লিক করুন।</p>
          <Link href="/" className="inline-block mt-6 bg-terracotta text-white px-8 py-2.5 rounded-full font-bold hover:bg-clay transition-all shadow-lg shadow-terracotta/20">
            কেনাকাটা করুন
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wishlist.map((product) => (
            <div key={product._id} className="bg-cream/30 border border-cream-dark rounded-2xl p-4 flex gap-4 hover:shadow-md transition-all group">
              <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center text-4xl shadow-inner flex-shrink-0">
                {product.icon || "🏺"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-text-dark truncate leading-snug">{product.name}</h3>
                    <p className="text-[10px] text-text-light uppercase tracking-wider">{product.category}</p>
                  </div>
                  <button 
                    onClick={() => removeFromWishlist(product._id)}
                    className="text-text-light hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-terracotta">৳{product.price.toLocaleString("bn-BD")}</span>
                    {product.originalPrice && (
                      <span className="text-[10px] text-text-light line-through">৳{product.originalPrice.toLocaleString("bn-BD")}</span>
                    )}
                  </div>
                  <button 
                    onClick={() => addToCart({ ...product, id: product._id })}
                    className="flex items-center gap-1.5 bg-terracotta text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-clay transition-all"
                  >
                    <ShoppingCart size={14} /> কার্টে যোগ করুন
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
