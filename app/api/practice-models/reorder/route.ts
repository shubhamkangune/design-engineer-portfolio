import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

// PATCH - Reorder practice models (bulk update order field)
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { orderedIds } = body as { orderedIds: string[] }

    if (!orderedIds || !Array.isArray(orderedIds)) {
      return NextResponse.json(
        { error: "orderedIds array is required" },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const collection = db.collection("practiceModels")

    // Bulk update all models with their new order
    const bulkOps = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { id },
        update: { $set: { order: index } },
      },
    }))

    if (bulkOps.length > 0) {
      await collection.bulkWrite(bulkOps)
    }

    return NextResponse.json({ success: true, count: orderedIds.length })
  } catch (error) {
    console.error("Failed to reorder practice models:", error)
    return NextResponse.json(
      { error: "Failed to reorder practice models" },
      { status: 500 }
    )
  }
}
