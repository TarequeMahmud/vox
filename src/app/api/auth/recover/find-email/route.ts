import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { sendOTP } from "@/lib/sendOTP";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    const user = await query("SELECT * FROM users WHERE email = $1", [email]);

    if (user.rowCount === 0) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    try {
      await sendOTP(email);
      console.log("OTP sent successfully");
    } catch (error) {
      console.error("Error sending OTP:", error);
      return NextResponse.json(
        { error: "Failed to send OTP" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Email found" }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error finding email:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    console.error("Error finding email:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
