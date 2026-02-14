import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Middleware for parsing JSON bodies
  app.use(express.json());

  // Contact API Endpoint
  app.post("/api/contact", async (req, res) => {
    const { name, email, phone, message } = req.body;

    console.log("Received contact form submission:", { name, email, phone, message });

    try {
      // Setup email transporter
      // Note: User should provide these environment variables
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER || 'allaithwannous6737@gmail.com',
          pass: process.env.EMAIL_PASS, // App password for Gmail
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER || 'allaithwannous6737@gmail.com',
        to: 'allaithwannous6737@gmail.com',
        subject: `رسالة جديدة من الموقع: ${name}`,
        text: `
          لديك رسالة جديدة من موقع allaith-eng:
          
          الاسم: ${name}
          البريد الإلكتروني: ${email}
          رقم الهاتف: ${phone}
          
          الرسالة:
          ${message}
        `,
        html: `
          <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #2563eb;">رسالة جديدة من موقع allaith-eng</h2>
            <p><strong>الاسم:</strong> ${name}</p>
            <p><strong>البريد الإلكتروني:</strong> ${email}</p>
            <p><strong>رقم الهاتف:</strong> ${phone}</p>
            <hr style="border: 0; border-top: 1px solid #eee;" />
            <p><strong>الرسالة:</strong></p>
            <p style="background: #f9fafb; padding: 15px; border-radius: 5px;">${message}</p>
          </div>
        `,
        replyTo: email
      };

      // If no password is provided, we just log it and return success for simulation
      // In production, the user will need to provide EMAIL_PASS
      if (process.env.EMAIL_PASS) {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
      } else {
        console.log("Email simulation: No EMAIL_PASS provided. Logging message instead.");
      }

      res.status(200).json({ message: "Success" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
