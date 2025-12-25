import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

const defaultPracticeModels = [
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

// POST - Reset practice models to defaults
export async function POST() {
  try {
    const db = await getDatabase()
    const collection = db.collection("practiceModels")
    
    // Delete all existing practice models
    await collection.deleteMany({})
    
    // Insert default practice models
    await collection.insertMany(defaultPracticeModels)
    
    const models = await collection.find({}).toArray()
    
    return NextResponse.json(models)
  } catch (error) {
    console.error("Failed to reset practice models:", error)
    return NextResponse.json({ error: "Failed to reset practice models" }, { status: 500 })
  }
}
