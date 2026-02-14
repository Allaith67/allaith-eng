import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'allaithwannous6737@gmail.com',
        pass: process.env.EMAIL_PASS,
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

    if (process.env.EMAIL_PASS) {
      await transporter.sendMail(mailOptions);
    }

    return res.status(200).json({ message: 'Success' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
