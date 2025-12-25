import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export interface PracticeModel {
  _id?: string
  id: string
  name: string
  image: string // Can be URL path or base64
  viewer?: string // External Autodesk viewer link
  download?: string // Download link
}

const defaultPracticeModels: Omit<PracticeModel, "_id">[] = [
  {
    id: "v-block-assembly",
    name: "V-Block Assembly (Practice)",
    image: "/projects/practice/v-block-assembly.png",
    viewer: "https://autode.sk/4qfPYu8",
    download: "/cad-files/v-block-assembly.sldasm",
  },
  {
    id: "flat-sprocket",
    name: "Flat Sprocket (Practice)",
    image: "/projects/practice/flat-sprocket.png",
    viewer: "https://autode.sk/3MPor4i",
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
    
    const models = await collection.find({}).toArray()
    
    return NextResponse.json(models)
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
