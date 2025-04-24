import { NextResponse } from "next/server";

import redis from "@/lib/redis";

export async function POST(req: Request) {
  try {
    const { email, verificationCode } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    //retrieve the OTP from Redis
    const otp = await redis.get(`otp:${email}`);
    if (!otp) {
      return NextResponse.json(
        { error: "OTP not found or expired" },
        { status: 404 }
      );
    }
    //compare the OTP with the one provided by the user
    if (otp !== verificationCode) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 401 });
    }
    //delete the OTP from Redis
    await redis.del(`otp:${email}`);
    return NextResponse.json(
      { message: "OTP validated successfully" },
      { status: 200 }
    );
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
