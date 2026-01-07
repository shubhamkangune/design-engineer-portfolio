import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
export const revalidate = 60 // Cache for 60 seconds


export interface PracticeModel {
  _id?: string
  id: string
  name: string
  image: string // Can be URL path or base64
  viewer?: string // External Autodesk viewer link
  download?: string // Download link
  tools?: string[] // Design tools/software used
  order?: number // Display order for sorting
}

const defaultPracticeModels: Omit<PracticeModel, "_id">[] = [
  {
    id: "v-block-assembly",
    name: "V-Block Assembly (Practice)",
    image: "/projects/practice/v-block-assembly.png",
    viewer: "https://autode.sk/4qfPYu8",
    download: "/cad-files/v-block-assembly.sldasm",
    order: 0,
  },
  {
    id: "flat-sprocket",
    name: "Flat Sprocket (Practice)",
    image: "/projects/practice/flat-sprocket.png",
    viewer: "https://autode.sk/3MPor4i",
    order: 1,
  },
]

// GET - Fetch all practice models
export async function GET() {
  try {
    const db = await getDatabase()
    const collection = db.collection("practiceModels")
    
    // Check if collection is empty, seed with defaults
    const count = await collection.countDocuments()
    if (count === 0) {
      await collection.insertMany(defaultPracticeModels)
    }
    
    // Sort by order field, then by _id for consistent ordering
    const models = await collection.find({}).sort({ order: 1, _id: 1 }).toArray()
    
    // Add default "SolidWorks" tool and order for models without them
    const modelsWithDefaults = models.map((model: any, index: number) => ({
      ...model,
      tools: model.tools && model.tools.length > 0 ? model.tools : ["SolidWorks"],
      order: model.order ?? index,
    }))
    
    return NextResponse.json(modelsWithDefaults, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    })
  } catch (error) {
    console.error("Failed to fetch practice models:", error)
    // Return default models on error so UI doesn't break
    return NextResponse.json(defaultPracticeModels)
  }
}

// POST - Create a new practice model
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const db = await getDatabase()
    const collection = db.collection("practiceModels")
    
    const newModel = {
      ...body,
      id: `practice-${Date.now()}`,
    }
    
    await collection.insertOne(newModel)
    
    return NextResponse.json(newModel, { status: 201 })
  } catch (error) {
    console.error("Failed to create practice model:", error)
    return NextResponse.json({ error: "Failed to create practice model" }, { status: 500 })
  }
}
