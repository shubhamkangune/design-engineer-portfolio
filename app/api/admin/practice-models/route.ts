import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

// GET - Fetch ALL practice models (including hidden ones) for admin panel
export async function GET() {
  try {
    const db = await getDatabase()
    const collection = db.collection("practiceModels")
    
    const models = await collection.find({}).sort({ order: 1, _id: 1 }).toArray()
    
    return NextResponse.json(models)
  } catch (error) {
    console.error("Failed to fetch practice models for admin:", error)
    return NextResponse.json([], { status: 500 })
  }
}
