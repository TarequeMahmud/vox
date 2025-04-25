import { NextResponse } from "next/server";
import { verifyOTP } from "@/lib/verifyOTP";
import { recoveryToken } from "@/lib/recoveryToken";
export const POST = async (req: Request) => {
  try {
    const { email, verificationCode } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const result = await verifyOTP(email, verificationCode);
    if (result === null) {
      return NextResponse.json(
        { error: "OTP not found or expired" },
        { status: 404 }
      );
    }
    if (result === "OTP_NOT_EQUAL") {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 401 });
    }

    const token = await recoveryToken(email, "GENERATE");

    return NextResponse.json(
      { message: "OTP validated successfully", token },
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
};
