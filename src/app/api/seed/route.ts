import { NextResponse } from "next/server";
import { seedDatabase } from "@/lib/seed";

export async function GET() {
  try {
    // Basic protection - could check for an environment variable here
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Seeding is disabled in production" }, { status: 403 });
    }

    await seedDatabase();
    return NextResponse.json({ success: true, message: "Database seeded successfully" });
  } catch (error) {
    console.error("Seed Route Error:", error);
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
  }
}
