"use client";

import React from "react";
import { X, Package, User, Phone, MapPin, Calendar, Clock, ShoppingBag } from "lucide-react";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  icon?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  items: OrderItem[];
  totalPrice: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (orderId: string, newStatus: Order["status"]) => Promise<void>;
  updating: string | null;
}

const statusMap: Record<string, { label: string, class: string }> = {
  pending: { label: "অপেক্ষমান", class: "bg-amber-100 text-amber-700 border-amber-200" },
  processing: { label: "প্রসেসিং", class: "bg-blue-100 text-blue-700 border-blue-200" },
  shipped: { label: "শিপড", class: "bg-purple-100 text-purple-700 border-purple-200" },
  delivered: { label: "ডেলিভারড", class: "bg-green-100 text-green-700 border-green-200" },
  cancelled: { label: "বাতিল", class: "bg-red-100 text-red-700 border-red-200" },
};

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, isOpen, onClose, onStatusUpdate, updating }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-text-dark/55 z-[9999] backdrop-blur-[3px] flex items-center justify-center p-4">
      <div className="bg-white rounded-[32px] w-full max-w-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-br from-terracotta to-clay p-6 flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="font-tiro text-2xl text-white flex items-center gap-2">
              <ShoppingBag size={24} /> অর্ডার বিস্তারিত
            </h2>
            <p className="text-white/80 text-xs mt-1">অর্ডার নম্বর: {order.orderNumber}</p>
          </div>
          <button 
            onClick={onClose}
            className="bg-white/20 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-text-dark flex items-center gap-2 border-b border-cream-dark pb-2">
                <User size={18} className="text-terracotta" /> কাস্টমার তথ্য
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User size={16} className="text-clay mt-1" />
                  <div>
                    <div className="text-[10px] text-text-light uppercase tracking-wider">নাম</div>
                    <div className="text-sm font-semibold text-text-dark">{order.customer.name}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-clay mt-1" />
                  <div>
                    <div className="text-[10px] text-text-light uppercase tracking-wider">ফোন নম্বর</div>
                    <div className="text-sm font-semibold text-text-dark">{order.customer.phone}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-clay mt-1" />
                  <div>
                    <div className="text-[10px] text-text-light uppercase tracking-wider">ডেলিভারি ঠিকানা</div>
                    <div className="text-sm font-semibold text-text-dark leading-relaxed">{order.customer.address}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Status & Date */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-text-dark flex items-center gap-2 border-b border-cream-dark pb-2">
                <Package size={18} className="text-terracotta" /> অর্ডার স্ট্যাটাস
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar size={16} className="text-clay mt-1" />
                  <div>
                    <div className="text-[10px] text-text-light uppercase tracking-wider">অর্ডার তারিখ</div>
                    <div className="text-sm font-semibold text-text-dark">
                      {new Date(order.createdAt).toLocaleDateString("bn-BD", { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={16} className="text-clay mt-1" />
                  <div>
                    <div className="text-[10px] text-text-light uppercase tracking-wider">সময়</div>
                    <div className="text-sm font-semibold text-text-dark">
                      {new Date(order.createdAt).toLocaleTimeString("bn-BD")}
                    </div>
                  </div>
                </div>
                <div className="pt-2">
                  <div className="text-[10px] text-text-light uppercase tracking-wider mb-2">স্ট্যাটাস পরিবর্তন করুন</div>
                  <select 
                    value={order.status}
                    disabled={updating === order._id}
                    onChange={(e) => onStatusUpdate(order._id, e.target.value as Order["status"])}
                    className={`w-full text-xs font-bold px-4 py-2.5 rounded-xl border outline-none cursor-pointer appearance-none transition-all ${statusMap[order.status].class}`}
                  >
                    <option value="pending">অপেক্ষমান</option>
                    <option value="processing">প্রসেসিং</option>
                    <option value="shipped">শিপড</option>
                    <option value="delivered">ডেলিভারড</option>
                    <option value="cancelled">বাতিল</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-text-dark flex items-center gap-2 border-b border-cream-dark pb-2">
              <ShoppingBag size={18} className="text-terracotta" /> পণ্যের তালিকা
            </h3>
            <div className="bg-cream/50 rounded-2xl border border-cream-dark overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-cream border-b border-cream-dark">
                    <th className="px-6 py-4 text-[10px] font-bold text-text-light uppercase tracking-widest">পণ্য</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-text-light uppercase tracking-widest text-center">পরিমাণ</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-text-light uppercase tracking-widest text-right">মূল্য</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-text-light uppercase tracking-widest text-right">মোট</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-dark">
                  {order.items.map((item, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl shadow-inner">
                            {item.icon || "🏺"}
                          </div>
                          <span className="text-sm font-semibold text-text-dark">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-medium text-text-mid">{item.qty} টি</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-medium text-text-mid">৳{item.price.toLocaleString("bn-BD")}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-bold text-text-dark">৳{(item.price * item.qty).toLocaleString("bn-BD")}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-cream/50">
                    <td colSpan={3} className="px-6 py-5 text-right font-bold text-text-dark">সর্বমোট</td>
                    <td className="px-6 py-5 text-right font-bold text-terracotta text-lg">৳{order.totalPrice.toLocaleString("bn-BD")}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-cream-dark bg-white">
          <button 
            onClick={onClose}
            className="w-full bg-cream text-text-mid border border-cream-dark py-3.5 rounded-xl font-bold hover:bg-cream-dark/50 transition-all"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
