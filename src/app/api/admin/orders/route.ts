import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";

// Fetch all orders for admin
export async function GET() {
  try {
    await dbConnect();
    const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// Update order status
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;
    if (!id || !status) return NextResponse.json({ error: "Order ID and status are required" }, { status: 400 });
    
    await dbConnect();
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    
    return NextResponse.json({ success: true, order });
  } catch {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

// Delete order
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    
    await dbConnect();
    const order = await Order.findByIdAndDelete(id);
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    
    return NextResponse.json({ success: true, message: "Order deleted" });
  } catch {
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
}
