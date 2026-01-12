import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

// GET - Fetch ALL designs (including hidden ones) for admin panel
export async function GET() {
  try {
    const db = await getDatabase()
    const collection = db.collection("designs")
    
    const designs = await collection.find({}).toArray()
    
    return NextResponse.json(designs)
  } catch (error) {
    console.error("Failed to fetch designs for admin:", error)
    return NextResponse.json([], { status: 500 })
  }
}
