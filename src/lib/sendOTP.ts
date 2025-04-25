import { transporter } from "@/lib/mailer";
import redis from "@/lib/redis";

export const sendOTP = async (email: string) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiryRedis = 10 * 60;
    await transporter.sendMail({
      from: '"Vox AI" <no-reply@voxai.com>',
      to: email,
      subject: "Verify your email address",
      html: `
              <p>Thanks for signing up!</p>
              <p>To complete your registration, please verify your email address by entering the following OTP:</p>
              <h2 style="font-size: 24px; font-weight: bold;">${otp}</h2>
              <p>If you didn't request this, please ignore this email.</p>
              <p>Best regards,</p>
              <p>The Vox AI Team</p>
              <p style="font-size: 12px; color: #888;">This is an automated message. Please do not reply.</p>
              <p style="font-size: 12px; color: #888;">If you have any questions, please contact our support team.</p>
              <p style="font-size: 12px; color: #888;">&copy; ${new Date().getFullYear()} Vox AI. All rights reserved.</p>
           
            `,
    });
    await redis.set(`otp:${email}`, otp.toString(), {
      EX: otpExpiryRedis,
    });

    return { message: "OTP sent successfully" };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error sending OTP:", error.message);
      throw new Error("Failed to send OTP");
    }
    console.error("Error sending OTP:", error);
    throw new Error("Internal Server Error");
  }
};
