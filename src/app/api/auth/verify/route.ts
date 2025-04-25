import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyOTP } from "@/lib/verifyOTP";

export async function POST(req: Request) {
  try {
    const { email, verificationCode } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    verifyOTP(email, verificationCode)
      .then((result) => {
        if (result === null) {
          return NextResponse.json(
            { error: "OTP not found or expired" },
            { status: 404 }
          );
        }
        if (result === "OTP_NOT_EQUAL") {
          return NextResponse.json({ error: "Invalid OTP" }, { status: 401 });
        }
      })
      .catch((error) => {
        console.error("Error verifying OTP:", error);
        return NextResponse.json(
          { error: "Internal server error" },
          { status: 500 }
        );
      });

    //if the OTP is valid, update the user's status in the database
    const user = await query(
      "UPDATE users SET validated = true WHERE email = $1 RETURNING *",
      [email]
    );
    if (user.rowCount === 0) {
      return NextResponse.json(
        { error: "Failed to update user status" },
        { status: 500 }
      );
    }
    //delete the OTP from Redis

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
