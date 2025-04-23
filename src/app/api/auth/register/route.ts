import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";
import { DatabaseError } from "pg";

export async function POST(request: Request) {
  try {
    const { name, username, email, password, phone } = await request.json();

    if (!name || !username || !email || !password || !phone) {
      return NextResponse.json(
        { error: "All fields are required and terms must be accepted" },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);

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

      return NextResponse.json(
        { message: "User registered successfully" },
        { status: 201 }
      );
    } catch (dbError) {
      if (dbError instanceof DatabaseError) {
        console.error("Database error:", dbError);
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
