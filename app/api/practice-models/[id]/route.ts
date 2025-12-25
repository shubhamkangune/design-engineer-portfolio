import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

// GET - Fetch single practice model
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = await getDatabase()
    const collection = db.collection("practiceModels")
    
    const model = await collection.findOne({ id })
    
    if (!model) {
      return NextResponse.json({ error: "Practice model not found" }, { status: 404 })
    }
    
    return NextResponse.json(model)
  } catch (error) {
    console.error("Failed to fetch practice model:", error)
    return NextResponse.json({ error: "Failed to fetch practice model" }, { status: 500 })
  }
}

// PUT - Update a practice model
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const db = await getDatabase()
    const collection = db.collection("practiceModels")
    
    const result = await collection.findOneAndUpdate(
      { id },
      { $set: body },
      { returnDocument: "after" }
    )
    
    if (!result) {
      return NextResponse.json({ error: "Practice model not found" }, { status: 404 })
    }
    
    return NextResponse.json(result)
  } catch (error) {
    console.error("Failed to update practice model:", error)
    return NextResponse.json({ error: "Failed to update practice model" }, { status: 500 })
  }
}

// DELETE - Delete a practice model
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = await getDatabase()
    const collection = db.collection("practiceModels")
    
    const result = await collection.deleteOne({ id })
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Practice model not found" }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete practice model:", error)
    return NextResponse.json({ error: "Failed to delete practice model" }, { status: 500 })
  }
}
