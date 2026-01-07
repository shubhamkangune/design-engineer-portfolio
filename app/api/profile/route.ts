import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";

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
};

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("portfolio");
    const collection = db.collection<ProfileSettings>("profile");

    let profile = await collection.findOne({});

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
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("portfolio");
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

    // Upsert: update if exists, create if not
    const result = await collection.findOneAndUpdate(
      {},
      { 
        $set: updateData,
        $setOnInsert: {
          ...defaultProfile,
          ...updateData,
        }
      },
      { 
        upsert: true, 
        returnDocument: "after" 
      }
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
