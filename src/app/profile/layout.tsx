"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Package, Heart, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const menuItems = [
    { name: "প্রোফাইল", href: "/profile", icon: User },
    { name: "আমার অর্ডার", href: "/profile/orders", icon: Package },
    { name: "উইশলিস্ট", href: "/profile/wishlist", icon: Heart },
  ];

  return (
    <main className="min-h-screen bg-cream">
      <Header />
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-cream-dark sticky top-24">
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                        isActive
                          ? "bg-terracotta text-white shadow-lg shadow-terracotta/20"
                          : "text-text-mid hover:bg-cream hover:text-terracotta"
                      }`}
                    >
                      <Icon size={18} />
                      {item.name}
                    </Link>
                  );
                })}
                <hr className="my-4 border-cream-dark" />
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all w-full text-left"
                >
                  <LogOut size={18} />
                  লগআউট
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-cream-dark min-h-[500px]">
              {children}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default ProfileLayout;
