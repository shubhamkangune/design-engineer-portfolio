import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

// GET - Fetch single design
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = await getDatabase()
    const collection = db.collection("designs")
    
    const design = await collection.findOne({ id })
    
    if (!design) {
      return NextResponse.json({ error: "Design not found" }, { status: 404 })
    }
    
    return NextResponse.json(design)
  } catch (error) {
    console.error("Failed to fetch design:", error)
    return NextResponse.json({ error: "Failed to fetch design" }, { status: 500 })
  }
}

// PUT - Update a design
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const db = await getDatabase()
    const collection = db.collection("designs")
    
    const result = await collection.findOneAndUpdate(
      { id },
      { $set: body },
      { returnDocument: "after" }
    )
    
    if (!result) {
      return NextResponse.json({ error: "Design not found" }, { status: 404 })
    }
    
    return NextResponse.json(result)
  } catch (error) {
    console.error("Failed to update design:", error)
    return NextResponse.json({ error: "Failed to update design" }, { status: 500 })
  }
}

// DELETE - Delete a design
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = await getDatabase()
    const collection = db.collection("designs")
    
    const result = await collection.deleteOne({ id })
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Design not found" }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete design:", error)
    return NextResponse.json({ error: "Failed to delete design" }, { status: 500 })
  }
}
