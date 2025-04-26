import { query } from "@/lib/db";
import * as bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

async function seedUsers() {
  console.log("Creating user table if it does not exist...");

  await query(`
            CREATE TABLE IF NOT EXISTS users (
               id UUID PRIMARY KEY,
               name VARCHAR(100) NOT NULL,
               email VARCHAR(100) UNIQUE NOT NULL,
               password VARCHAR(255) NOT NULL,
               created_at TIMESTAMP DEFAULT NOW()
            );
        `);

  const hashedPassword = await bcrypt.hash("aaaaaa", 10);
  const userId = randomUUID();

  await query(
    `
            INSERT INTO users (id, name, email, password, created_at)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (email) DO NOTHING;
        `,
    [userId, "aaa", "aaa@aa.a", hashedPassword, new Date().toISOString()]
  );

  console.log("Sample user seeded.");
}

export async function GET() {
  // Call the seedUsers function
  console.log("Seeding users...");

  try {
    await seedUsers();
    return NextResponse.json({
      message: "Seeding Complete",
    });
  } catch (error) {
    console.error("Error seeding:", error);
    return NextResponse.json({
      response: "Seeding failed",
      message:
        error instanceof Error
          ? error.message
          : "Seeding failed with unknown error",
    });
  }
}
