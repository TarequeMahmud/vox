import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    let user;
    try {
      user = await query("SELECT * FROM users WHERE email = $1", [email]);
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Failed to query user from database" },
        { status: 500 }
      );
    }

    if (user.rowCount === 0) {
      console.log("Invalid email");
      return NextResponse.json({ error: "Invalid email" }, { status: 401 });
    }

    const userData = user.rows[0];
    // Check if the user is validated
    if (!userData.validated) {
      console.log("User not validated");
      return NextResponse.json(
        { error: "User not validated" },
        { status: 401 }
      );
    }

    let passwordMatch;
    try {
      passwordMatch = await bcrypt.compare(password, userData.password);
    } catch (hashError) {
      console.error("Password hash comparison failed:", hashError);
      return NextResponse.json(
        { error: "Failed to process password" },
        { status: 500 }
      );
    }

    if (passwordMatch) {
      let token;
      try {
        token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
          expiresIn: "1h",
        });
      } catch (jwtError) {
        console.error("JWT generation failed:", jwtError);
        return NextResponse.json(
          { error: "Failed to generate token" },
          { status: 500 }
        );
      }

      const response = NextResponse.json(
        { message: "Login successful" },
        { status: 200 }
      );
      response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      return response;
    } else {
      console.log("Invalid password");
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
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
