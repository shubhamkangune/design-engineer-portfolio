import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

interface SkillCategory {
  icon: string;
  title: string;
  items: string[];
}

interface ProfileSettings {
  _id?: string;
  profilePhoto: string;
  name: string;
  title: string;
  tagline: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  skills: SkillCategory[];
  resumeUrl: string;
  resumeFileName?: string;
  resumeBase64?: string; // Store resume file in database for Vercel
  updatedAt: Date;
}

const defaultProfile: Omit<ProfileSettings, "_id" | "updatedAt"> = {
  profilePhoto: "",
  name: "SHUBHAM KANGUNE",
  title: "Automotive Plastic Trim Design Engineer | CATIA V5 | Interior & Exterior Trims",
  tagline: "Transforming complex engineering challenges into innovative mechanical solutions",
  bio: "Passionate Mechanical Design Engineer with expertise in CAD/CAM, product development, and manufacturing processes. I specialize in creating efficient, cost-effective designs that bridge the gap between concept and production.",
  email: "shubhamkangune@gmail.com",
  phone: "+91 9356012407",
  location: "Pune, India",
  linkedin: "https://www.linkedin.com/in/shubham-kangune-876553221",
  resumeUrl: "/attached_assets/Shubham_Kangune_Mechanical_Design_Engineer_2025_1766061788798.pdf",
  skills: [
    {
      icon: "DraftingCompass",
      title: "CAD Software",
      items: ["CATIA V5 (Part, Assembly, Drafting)", "SolidWorks", "AutoCAD (2D Drafting)", "Fusion 360"]
    },
    {
      icon: "Layers",
      title: "Plastic Product Design",
      items: ["Wall Thickness & Draft Angles", "Ribs, Bosses & Gussets", "Snaps, Clips & Locators", "Parting Line & Tooling Direction"]
    },
    {
      icon: "Cog",
      title: "Engineering Fundamentals",
      items: ["GD&T (Datums, Profile, Position)", "Tool & Die Design Basics", "ANSYS (Basic Structural)", "2D/3D Technical Drawings"]
    },
    {
      icon: "Database",
      title: "Tooling & Manufacturing",
      items: ["Injection Molding Basics", "Undercuts, Sliders & Lifters", "Blanking Die Design", "DFM Awareness"]
    }
  ],
};

export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection<ProfileSettings>("profile");

    const profile = await collection.findOne({});

    if (!profile) {
      // Return default profile if none exists
      return NextResponse.json({
        ...defaultProfile,
        updatedAt: new Date(),
      });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile", details: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("📥 Profile PUT request received");
    console.log("📋 Fields present:", Object.keys(body));
    
    const db = await getDatabase();
    const collection = db.collection<ProfileSettings>("profile");

    const updateData: Partial<ProfileSettings> = {
      updatedAt: new Date(),
    };

    // Check if profile exists first (moved to top to avoid duplicate queries)
    const existing = await collection.findOne({});
    console.log("🔍 Existing profile found:", !!existing);

    // Only update fields that are provided
    if (body.profilePhoto !== undefined) updateData.profilePhoto = body.profilePhoto;
    if (body.name !== undefined) updateData.name = body.name;
    if (body.title !== undefined) updateData.title = typeof body.title === 'string' ? body.title.replace(/\|\s*$/, '').trim() : body.title;
    if (body.tagline !== undefined) updateData.tagline = body.tagline;
    if (body.bio !== undefined) updateData.bio = body.bio;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.linkedin !== undefined) updateData.linkedin = body.linkedin;
    if (body.skills !== undefined) (updateData as any).skills = body.skills;
    
    // Handle resume upload
    if (body.resumeUrl !== undefined) {
      console.log("📄 Resume URL detected:", body.resumeUrl.substring(0, 50) + "...");
      
      if (body.resumeUrl.startsWith("data:application/pdf;base64,")) {
        console.log("🔄 Processing base64 PDF upload...");
        
        // For Vercel compatibility, store the base64 directly in database
        // instead of writing to file system
        updateData.resumeBase64 = body.resumeUrl;
        updateData.resumeFileName = body.resumeFileName || "Resume.pdf";
        updateData.resumeUrl = "/api/profile/resume"; // Serve from API route
        console.log("✅ Resume stored in database (Vercel-compatible)");
        
      } else if (body.resumeUrl) {
        // It's already a URL path, just save it
        updateData.resumeUrl = body.resumeUrl;
        if (body.resumeFileName) {
          updateData.resumeFileName = body.resumeFileName;
        }
        console.log("✅ Resume URL saved (direct path):", updateData.resumeUrl);
      }
    }

    let result;
    if (existing) {
      // Update existing document
      const updateResult = await collection.findOneAndUpdate(
        { _id: existing._id },
        { $set: updateData },
        { returnDocument: "after" }
      );
      result = updateResult;
      console.log("✅ Profile updated successfully in MongoDB");
    } else {
      // Insert new document with defaults merged with updates
      const newProfile = {
        ...defaultProfile,
        ...updateData,
      };
      const insertResult = await collection.insertOne(newProfile as ProfileSettings);
      result = await collection.findOne({ _id: insertResult.insertedId });
      console.log("✅ New profile created successfully in MongoDB");
    }

    if (!result) {
      console.error("❌ Failed to save profile - result is null");
      return NextResponse.json(
        { error: "Failed to save profile - no result returned" },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile", details: String(error) },
      { status: 500 }
    );
  }
}
