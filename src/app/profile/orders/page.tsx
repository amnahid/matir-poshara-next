"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Package, Calendar, ChevronRight } from "lucide-react";

interface Order {
  _id: string;
  orderNumber: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  items: {
    name: string;
    qty: number;
    icon?: string;
  }[];
}

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/user/orders");
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => fetchOrders(), 0);
  }, []);

  const statusMap: Record<string, { label: string, class: string }> = {
    pending: { label: "অপেক্ষমান", class: "bg-amber-100 text-amber-700 border-amber-200" },
    processing: { label: "প্রসেসিং", class: "bg-blue-100 text-blue-700 border-blue-200" },
    shipped: { label: "শিপড", class: "bg-purple-100 text-purple-700 border-purple-200" },
    delivered: { label: "ডেলিভারড", class: "bg-green-100 text-green-700 border-green-200" },
    cancelled: { label: "বাতিল", class: "bg-red-100 text-red-700 border-red-200" },
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <Loader2 className="animate-spin text-terracotta" size={40} />
        <p className="text-sm text-text-mid font-medium">অর্ডার লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-tiro text-2xl text-text-dark mb-2">আমার অর্ডারসমূহ</h2>
      <p className="text-text-light text-sm mb-8">আপনার সকল বর্তমান ও অতীত অর্ডারের তালিকা</p>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-cream/30 rounded-3xl border-2 border-dashed border-cream-dark">
          <Package size={48} className="text-cream-dark mx-auto mb-4" />
          <h3 className="font-tiro text-lg text-text-dark mb-2">কোনো অর্ডার পাওয়া যায়নি</h3>
          <p className="text-sm text-text-light max-w-xs mx-auto">আপনি এখনো কোনো পণ্য অর্ডার করেননি। আমাদের সংগ্রহ থেকে পছন্দের পণ্যটি খুঁজে নিন।</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-cream/30 border border-cream-dark rounded-2xl p-6 hover:shadow-md transition-all group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-text-dark">{order.orderNumber}</span>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusMap[order.status]?.class || "bg-gray-100 text-gray-700"}`}>
                      {statusMap[order.status]?.label || order.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-light">
                    <Calendar size={14} /> 
                    {new Date(order.createdAt).toLocaleDateString("bn-BD", { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6">
                  <div className="text-right">
                    <div className="text-xs text-text-light mb-0.5">মোট মূল্য</div>
                    <div className="text-lg font-bold text-terracotta font-tiro">৳{order.totalPrice.toLocaleString("bn-BD")}</div>
                  </div>
                  <ChevronRight size={20} className="text-text-light group-hover:text-terracotta transition-colors" />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-cream-dark/50 flex flex-wrap gap-2">
                {order.items.slice(0, 3).map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-lg border border-cream-dark text-xs">
                    <span className="text-lg">{item.icon || "🏺"}</span>
                    <span className="font-medium text-text-dark">{item.name}</span>
                    <span className="text-text-light">({item.qty})</span>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="flex items-center justify-center bg-white px-3 py-1.5 rounded-lg border border-cream-dark text-xs font-bold text-text-light">
                    +{order.items.length - 3} আরও
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
