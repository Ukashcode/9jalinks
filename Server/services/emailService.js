import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // Brevo uses STARTTLS on port 587, not implicit TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOtpEmail = async ({ to, fullName, otp }) => {
  const expiryMinutes = process.env.OTP_EXPIRY_MINUTES || 5;

  try {
    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to,
      subject: 'Your 9jaLinks verification code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #1E2433;">
          <h2 style="color: #1B2A4A;">Welcome to 9jaLinks</h2>
          <p>Hi ${fullName},</p>
          <p>Thanks for joining 9jaLinks. Use the code below to verify your email address:</p>
          <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1B2A4A; text-align: center; margin: 24px 0;">
            ${otp}
          </p>
          <p>This code expires in <strong>${expiryMinutes} minutes</strong>.</p>
          <p style="color: #B87A20; font-weight: 600;">
            Never share this OTP with anyone. 9jaLinks staff will never ask you for it.
          </p>
          <p>If you didn't request this code, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #D5DCEA; margin: 24px 0;" />
          <p style="font-size: 12px; color: #8698C1;">© 2026 9jaLinks</p>
        </div>
      `,
    });
  } catch (error) {
    throw new Error(`Failed to send OTP email: ${error.message}`);
  }
};