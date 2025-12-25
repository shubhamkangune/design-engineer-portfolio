import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

const defaultDesigns = [
  {
    id: "leather-cutting",
    title: "Leather Strip Cutting Device",
    description: "Semi-automated machine designed to enhance leather artisans' efficiency with precision cutting mechanism.",
    software: ["SolidWorks", "CAD Design"],
    category: "Academic Project",
    image: "/projects/leather-strip-cutting/lather_main.jpg",
    details: "Sponsored by Divyam Leather Crafts Pvt. Ltd. - Implemented innovative cutting mechanism reducing material waste and accelerating production.",
  },
  {
    id: "hydraulic-press",
    title: "Hydraulic Press Machine",
    description: "Functional hydraulic system design based on Pascal's Law with fabrication and testing procedures.",
    software: ["CAD Design", "Hydraulics"],
    category: "Academic Project",
    image: "/images/3d_hydraulic_press_cad.png",
    details: "Researched and applied Pascal's Law to design a functional press. Coordinated fabrication and developed testing procedure to validate efficiency.",
  },
  {
    id: "blanking-die",
    title: "Sheet Metal Blanking Die",
    description: "Optimized die design for precision sheet metal stamping with improved material usage and durability.",
    software: ["SolidWorks", "Tool & Die Design"],
    category: "Internship Work",
    image: "/images/3d_blanking_die_cad.png",
    details: "Designed at Maxpertise Technology Labs. Optimized geometry for better material usage and reduced wear during manufacturing.",
  },
]

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
