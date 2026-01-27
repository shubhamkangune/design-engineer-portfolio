import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { writeFile, mkdir, unlink, readdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

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
  updatedAt: Date;
}

const defaultProfile: Omit<ProfileSettings, "_id" | "updatedAt"> = {
  profilePhoto: "",
  name: "SHUBHAM KANGUNE",
  title: "Mechanical Design Engineer",
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

    // Only update fields that are provided
    if (body.profilePhoto !== undefined) updateData.profilePhoto = body.profilePhoto;
    if (body.name !== undefined) updateData.name = body.name;
    if (body.title !== undefined) updateData.title = body.title;
    if (body.tagline !== undefined) updateData.tagline = body.tagline;
    if (body.bio !== undefined) updateData.bio = body.bio;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.linkedin !== undefined) updateData.linkedin = body.linkedin;
    if (body.skills !== undefined) (updateData as any).skills = body.skills;
    
    // Handle resume upload - save base64 to file
    if (body.resumeUrl !== undefined) {
      console.log("📄 Resume URL detected:", body.resumeUrl.substring(0, 50) + "...");
      
      if (body.resumeUrl.startsWith("data:application/pdf;base64,")) {
        console.log("🔄 Processing base64 PDF upload...");
        
        try {
          // Get existing profile to delete old resume file
          const existing = await collection.findOne({});
          
          // Extract base64 data
          const base64Data = body.resumeUrl.replace("data:application/pdf;base64,", "");
          const buffer = Buffer.from(base64Data, "base64");
          console.log("📦 Converted base64 to buffer:", buffer.length, "bytes");
          
          // Generate filename
          const filename = `resume_${Date.now()}.pdf`;
          const uploadDir = path.join(process.cwd(), "public", "uploads");
          
          // Ensure upload directory exists
          console.log("📁 Ensuring upload directory exists:", uploadDir);
          await mkdir(uploadDir, { recursive: true });
          
          // Write file
          const filePath = path.join(uploadDir, filename);
          await writeFile(filePath, buffer);
          console.log("✅ Resume file written successfully:", filePath);
          
          // Delete old resume file if it exists and is in uploads folder
          if (existing?.resumeUrl && existing.resumeUrl.startsWith("/uploads/")) {
            const oldFilename = existing.resumeUrl.replace("/uploads/", "");
            const oldFilePath = path.join(uploadDir, oldFilename);
            
            try {
              if (existsSync(oldFilePath)) {
                await unlink(oldFilePath);
                console.log("🗑️ Deleted old resume file:", oldFilename);
              }
            } catch (deleteError) {
              console.warn("⚠️ Could not delete old resume file:", deleteError);
              // Don't fail the upload if deletion fails
            }
          }
          
          // Update with new file path
          updateData.resumeUrl = `/uploads/${filename}`;
          console.log("✅ Resume URL saved to database:", updateData.resumeUrl);
          
        } catch (fileError) {
          console.error("❌ Error saving resume file:", fileError);
          return NextResponse.json(
            { 
              error: "Failed to save resume file", 
              details: fileError instanceof Error ? fileError.message : String(fileError) 
            },
            { status: 500 }
          );
        }
      } else if (body.resumeUrl) {
        // It's already a URL path, just save it
        updateData.resumeUrl = body.resumeUrl;
        console.log("✅ Resume URL saved (direct path):", updateData.resumeUrl);
      }
    }

    // Check if profile exists first
    const existing = await collection.findOne({});
    console.log("🔍 Existing profile found:", !!existing);

    let result;
    if (existing) {
      // Update existing document
      result = await collection.findOneAndUpdate(
        { _id: existing._id },
        { $set: updateData },
        { returnDocument: "after" }
      );
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
      console.error("Failed to save profile - result is null");
      return NextResponse.json(
        { error: "Failed to save profile" },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile", details: String(error) },
      { status: 500 }
    );
  }
}
