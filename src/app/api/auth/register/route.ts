import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";
import { DatabaseError } from "pg";
import { transporter } from "@/lib/mailer";
import redis from "@/lib/redis";

export async function POST(request: Request) {
  try {
    const { name, username, email, password, phone } = await request.json();

    if (!name || !username || !email || !password || !phone) {
      return NextResponse.json(
        { error: "All fields are required and terms must be accepted" },
        { status: 400 }
      );
    }
    // hash password - generate otp - generate otp expiry
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiryRedis = 10 * 60;

    try {
      const insertUser = await query(
        "INSERT INTO users(name, username, email, password, phone) VALUES($1,$2,$3,$4,$5) RETURNING *",
        [name, username, email, hashedPassword, phone]
      );

      if (!insertUser || insertUser.rowCount === 0) {
        return NextResponse.json(
          { error: "Failed to register user" },
          { status: 500 }
        );
      }

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

      // Store OTP in Redis with a 10-minute expiry
      await redis.set(`otp:${email}`, otp.toString(), {
        EX: otpExpiryRedis,
      });
      return NextResponse.json(
        { message: "User registered successfully. Verification email sent." },
        { status: 201 }
      );
    } catch (dbError) {
      if (dbError instanceof DatabaseError) {
        console.error("Database error:", dbError);
        if (dbError.code === "ETIMEDOUT") {
          return NextResponse.json(
            { error: "Database connection timed out" },
            { status: 500 }
          );
        }
        if (dbError.code === "23505") {
          if (dbError.constraint === "users_email_key") {
            return NextResponse.json(
              { error: "Email already in use" },
              { status: 409 }
            );
          }
          if (dbError.constraint === "users_username_key") {
            return NextResponse.json(
              { error: "Username already in use" },
              { status: 409 }
            );
          }
          if (dbError.constraint === "users_phone_key") {
            return NextResponse.json(
              { error: "Phone number already in use" },
              { status: 409 }
            );
          }
        }
        return NextResponse.json(
          { error: "Failed to query user from database" },
          { status: 500 }
        );
      }
    }
  } catch (error: unknown) {
    console.error("Unexpected server error:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
