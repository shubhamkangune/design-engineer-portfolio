import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
export const revalidate = 300 // Cache for 5 minutes (300 seconds)

import { ObjectId } from "mongodb"

export interface Design {
  _id?: string
  id: string
  title: string
  description: string
  software: string[]
  image: string
  category: string
  details?: string
  visible?: boolean
}

const defaultDesigns: Omit<Design, "_id">[] = []

// GET - Fetch all designs
export async function GET() {
  try {
    const db = await getDatabase()
    const collection = db.collection("designs")
    
    // Check if collection is empty, seed with defaults
    const count = await collection.countDocuments()
    if (count === 0) {
      await collection.insertMany(defaultDesigns)
    }
    
    const designs = await collection.find({ visible: { $ne: false } }).toArray()
    
    return NextResponse.json(designs, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    })
  } catch (error) {
    console.error("Failed to fetch designs:", error)
    // Return default designs on error so UI doesn't break
    return NextResponse.json(defaultDesigns)
  }
}

// POST - Create a new design
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const db = await getDatabase()
    const collection = db.collection("designs")
    
    const newDesign = {
      ...body,
      id: `design-${Date.now()}`,
    }
    
    await collection.insertOne(newDesign)
    
    return NextResponse.json(newDesign, { status: 201 })
  } catch (error) {
    console.error("Failed to create design:", error)
    return NextResponse.json({ error: "Failed to create design" }, { status: 500 })
  }
}
