import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

// Fetch all products for admin
export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// Add new product
export async function POST(request: Request) {
  try {
    const body = await request.json();
    await dbConnect();
    const product = await Product.create(body);
    return NextResponse.json({ success: true, product });
  } catch {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

// Update product
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    if (!id) return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    
    await dbConnect();
    const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    
    return NextResponse.json({ success: true, product });
  } catch {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// Delete product
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    
    await dbConnect();
    const product = await Product.findByIdAndDelete(id);
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    
    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
