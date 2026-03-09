import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface ContactPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactPayload = await request.json();
    
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Quick Mail API configuration
    const apiKey = process.env.QUICKMAIL_API_KEY || "qm_3957e84071f9675af64331e652e2c74971820cde807e6b723186dda40c55467b";
    const contactEmail = process.env.CONTACT_EMAIL || "shubhamcsc4656@gmail.com";

    if (!apiKey) {
      console.error("Quick Mail API key is not configured");
      return NextResponse.json(
        { error: "Email service is not configured" },
        { status: 500 }
      );
    }

    // Function to escape HTML
    const escapeHtml = (s: string) => {
      return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    };

    // Send email via Quick Mail API
    const response = await fetch('https://quick-mail.remainderzero.com/api/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: contactEmail,
        subject: subject || `New message from ${name}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden;">
                    
                    <!-- Header -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                          📬 New Contact Message
                        </h1>
                        <p style="margin: 10px 0 0 0; color: #ffffff; opacity: 0.95; font-size: 15px;">
                          Someone reached out via your portfolio
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px 30px;">
                        
                        <!-- Sender Info Card -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                          <tr>
                            <td>
                              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                  <td style="padding: 8px 0;">
                                    <span style="color: #4a5568; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Sender</span>
                                    <div style="margin-top: 5px; color: #1a202c; font-size: 18px; font-weight: 600;">
                                      ${escapeHtml(name)}
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td style="padding: 8px 0;">
                                    <span style="color: #4a5568; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Email</span>
                                    <div style="margin-top: 5px;">
                                      <a href="mailto:${escapeHtml(email)}" style="color: #667eea; font-size: 16px; text-decoration: none; font-weight: 500;">
                                        ${escapeHtml(email)}
                                      </a>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td style="padding: 8px 0;">
                                    <span style="color: #4a5568; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Subject</span>
                                    <div style="margin-top: 5px; color: #1a202c; font-size: 16px; font-weight: 500;">
                                      ${escapeHtml(subject || `Message from ${name}`)}
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        
                        <!-- Message Card -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border: 2px solid #e2e8f0; border-radius: 8px; padding: 25px;">
                          <tr>
                            <td>
                              <div style="color: #667eea; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 15px;">
                                💬 Message Content
                              </div>
                              <div style="color: #2d3748; font-size: 15px; line-height: 1.7; white-space: pre-wrap; word-wrap: break-word;">
                                ${escapeHtml(message)}
                              </div>
                            </td>
                          </tr>
                        </table>
                        
                        <!-- Action Button -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 30px;">
                          <tr>
                            <td align="center">
                              <a href="mailto:${escapeHtml(email)}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 35px; border-radius: 6px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">
                                Reply to ${escapeHtml(name)}
                              </a>
                            </td>
                          </tr>
                        </table>
                        
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f7fafc; padding: 25px 30px; border-top: 1px solid #e2e8f0;">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td align="center">
                              <p style="margin: 0; color: #718096; font-size: 13px; line-height: 1.6;">
                                This email was sent from your portfolio contact form<br/>
                                <span style="color: #a0aec0; font-size: 12px;">
                                  Powered by Quick Mail API • ${new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}
                                </span>
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Quick Mail API error:", response.status, errorData);
      return NextResponse.json(
        { error: "Failed to send email", details: errorData },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log("✅ Email sent successfully via Quick Mail:", result);

    return NextResponse.json({ 
      success: true, 
      message: "Email sent successfully" 
    });

  } catch (error) {
    console.error("Error sending contact email:", error);
    return NextResponse.json(
      { 
        error: "Failed to send email", 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}
