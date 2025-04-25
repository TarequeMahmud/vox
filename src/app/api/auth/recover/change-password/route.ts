import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";
import { recoveryToken } from "@/lib/recoveryToken";

export async function POST(req: Request) {
  try {
    const { email, newPassword, token } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    if (!newPassword) {
      return NextResponse.json(
        { error: "New password is required" },
        { status: 400 }
      );
    }
    //verify recovery token
    const storedToken = await recoveryToken(email, "VERIFY");

    if (!storedToken || storedToken !== token) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 403 }
      );
    }
    // hash the new password
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    const changePassword = await query(
      "UPDATE users SET password = $1 WHERE email = $2 RETURNING *",
      [hashedPassword, email]
    );
    if (changePassword.rowCount === 0) {
      return NextResponse.json(
        { error: "Failed to change password" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Password changed successfully" });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error changing password:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    console.error("Error changing password:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
