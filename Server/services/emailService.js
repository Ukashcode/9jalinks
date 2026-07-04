import dotenv from 'dotenv';

dotenv.config();

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

// Uses Brevo's HTTPS transactional email API instead of SMTP. Functionally
// identical from the caller's side (same function name, same params, same
// thrown-error behavior) — this only changes *how* the email gets sent.
// Switched from SMTP because outbound SMTP ports (587/465) were being
// blocked/timing out on Render's network, while HTTPS (443) is not.
// Uses the platform's built-in fetch (Node 18+) — no new dependency needed.
export const sendOtpEmail = async ({ to, fullName, otp }) => {
  const expiryMinutes = process.env.OTP_EXPIRY_MINUTES || 5;

  const html = `
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
  `;

  try {
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'api-key': process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          name: process.env.BREVO_FROM_NAME,
          email: process.env.BREVO_FROM_EMAIL,
        },
        to: [{ email: to, name: fullName }],
        subject: 'Your 9jaLinks verification code',
        htmlContent: html,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.message || `Brevo API responded with status ${response.status}`);
    }
  } catch (error) {
    throw new Error(`Failed to send OTP email: ${error.message}`);
  }
};