import nodemailer from "nodemailer";

interface ContactPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export async function sendContactEmail(payload: ContactPayload) {
  const { name, email, subject, message } = payload;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  // fallback to target contact email, default to provided owner email
  const to = process.env.CONTACT_EMAIL || "shubhamcsc4656@gmail.com";

  if (!host || !user || !pass) {
    throw new Error("SMTP is not configured. Set SMTP_HOST, SMTP_USER and SMTP_PASS environment variables.");
  }

  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const secure = (process.env.SMTP_SECURE || "false") === "true";

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });

  const mail = {
    from: `${name} <${email}>`,
    to,
    subject: subject || `New message from ${name}`,
    text: `${message}\n\n---\nFrom: ${name} <${email}>`,
    html: `<p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p><hr/><p>From: ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>`,
  } as const;

  await transporter.sendMail(mail);
}

function escapeHtml(s: string) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
