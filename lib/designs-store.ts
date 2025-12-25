// Design data store using localStorage

export interface Design {
  id: string
  title: string
  description: string
  software: string[]
  image: string
  category: string
  details?: string
}

const DESIGNS_KEY = "portfolio_designs"

// Default designs that come with the portfolio
const defaultDesigns: Design[] = [
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
    image: "/projects/leather-strip-cutting/hydro.png",
    details: "Researched and applied Pascal's Law to design a functional press. Coordinated fabrication and developed testing procedure to validate efficiency.",
  },
  {
    id: "blanking-die",
    title: "Sheet Metal Blanking Die",
    description: "Optimized die design for precision sheet metal stamping with improved material usage and durability.",
    software: ["SolidWorks", "Tool & Die Design"],
    category: "Internship Work",
    image: "/projects/leather-strip-cutting/intern.png",
    details: "Designed at Maxpertise Technology Labs. Optimized geometry for better material usage and reduced wear during manufacturing.",
  },
]

export function getDesigns(): Design[] {
  if (typeof window === "undefined") {
    return defaultDesigns
  }
  
  const stored = localStorage.getItem(DESIGNS_KEY)
  if (!stored) {
    // Initialize with default designs
    localStorage.setItem(DESIGNS_KEY, JSON.stringify(defaultDesigns))
    return defaultDesigns
  }
  
  try {
    return JSON.parse(stored)
  } catch {
    return defaultDesigns
  }
}

export function saveDesigns(designs: Design[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(DESIGNS_KEY, JSON.stringify(designs))
  }
}

export function addDesign(design: Omit<Design, "id">): Design {
  const designs = getDesigns()
  const newDesign: Design = {
    ...design,
    id: `design-${Date.now()}`,
  }
  designs.push(newDesign)
  saveDesigns(designs)
  return newDesign
}

export function updateDesign(id: string, updates: Partial<Design>): Design | null {
  const designs = getDesigns()
  const index = designs.findIndex((d) => d.id === id)
  if (index === -1) return null
  
  designs[index] = { ...designs[index], ...updates }
  saveDesigns(designs)
  return designs[index]
}

export function deleteDesign(id: string): boolean {
  const designs = getDesigns()
  const filtered = designs.filter((d) => d.id !== id)
  if (filtered.length === designs.length) return false
  
  saveDesigns(filtered)
  return true
}

export function getDesignById(id: string): Design | null {
  const designs = getDesigns()
  return designs.find((d) => d.id === id) || null
}

export function resetToDefaults(): void {
  saveDesigns(defaultDesigns)
}
