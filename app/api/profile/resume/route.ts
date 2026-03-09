import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

interface ProfileSettings {
  _id?: string;
  resumeBase64?: string;
  resumeFileName?: string;
  resumeUrl?: string;
}

export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection<ProfileSettings>("profile");

    const profile = await collection.findOne({});

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    // If resume is stored as base64 in database
    if (profile.resumeBase64) {
      // Extract base64 data
      const base64Data = profile.resumeBase64.replace("data:application/pdf;base64,", "");
      const buffer = Buffer.from(base64Data, "base64");
      
      // Get filename
      const filename = profile.resumeFileName || "Resume.pdf";
      
      // Return PDF file
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Content-Length": buffer.length.toString(),
        },
      });
    }

    // If resume URL is external or in public folder
    if (profile.resumeUrl && !profile.resumeUrl.includes("/api/")) {
      return NextResponse.redirect(profile.resumeUrl);
    }

    return NextResponse.json(
      { error: "Resume not found" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error fetching resume:", error);
    return NextResponse.json(
      { error: "Failed to fetch resume", details: String(error) },
      { status: 500 }
    );
  }
}
