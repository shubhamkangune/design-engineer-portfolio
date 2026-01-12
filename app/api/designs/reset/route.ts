import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

const defaultDesigns: any[] = []

// POST - Reset designs to defaults
export async function POST() {
  try {
    const db = await getDatabase()
    const collection = db.collection("designs")
    
    // Delete all existing designs
    await collection.deleteMany({})
    
    // Insert default designs
    await collection.insertMany(defaultDesigns)
    
    const designs = await collection.find({}).toArray()
    
    return NextResponse.json(designs)
  } catch (error) {
    console.error("Failed to reset designs:", error)
    return NextResponse.json({ error: "Failed to reset designs" }, { status: 500 })
  }
}
