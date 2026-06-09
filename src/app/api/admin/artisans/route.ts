import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Artisan from "@/models/Artisan";

// Fetch all artisans for admin
export async function GET() {
  try {
    await dbConnect();
    const artisans = await Artisan.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ artisans });
  } catch {
    return NextResponse.json({ error: "Failed to fetch artisans" }, { status: 500 });
  }
}

// Add new artisan
export async function POST(request: Request) {
  try {
    const body = await request.json();
    await dbConnect();
    const artisan = await Artisan.create(body);
    return NextResponse.json({ success: true, artisan });
  } catch {
    return NextResponse.json({ error: "Failed to create artisan" }, { status: 500 });
  }
}

// Update artisan
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    if (!id) return NextResponse.json({ error: "Artisan ID is required" }, { status: 400 });
    
    await dbConnect();
    const artisan = await Artisan.findByIdAndUpdate(id, updateData, { new: true });
    if (!artisan) return NextResponse.json({ error: "Artisan not found" }, { status: 404 });
    
    return NextResponse.json({ success: true, artisan });
  } catch {
    return NextResponse.json({ error: "Failed to update artisan" }, { status: 500 });
  }
}

// Delete artisan
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Artisan ID is required" }, { status: 400 });
    
    await dbConnect();
    const artisan = await Artisan.findByIdAndDelete(id);
    if (!artisan) return NextResponse.json({ error: "Artisan not found" }, { status: 404 });
    
    return NextResponse.json({ success: true, message: "Artisan deleted" });
  } catch {
    return NextResponse.json({ error: "Failed to delete artisan" }, { status: 500 });
  }
}
