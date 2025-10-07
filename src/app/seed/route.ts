// import { query } from "@/lib/db";
// import * as bcrypt from "bcryptjs";
// import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

// async function seedUsers() {
//   console.log("Creating user table if it does not exist...");

//   await query(`
//             CREATE TABLE IF NOT EXISTS users (
//                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//                name VARCHAR(100) NOT NULL,
//                username VARCHAR(100) UNIQUE NOT NULL,
//                email VARCHAR(100) UNIQUE NOT NULL,
//                password VARCHAR(255) NOT NULL,
//                phone VARCHAR(20),
//                validated BOOLEAN DEFAULT FALSE,
//                created_at TIMESTAMP DEFAULT NOW()
//             );
//         `);

//   const hashedPassword = await bcrypt.hash("aaaaaa", 10);
//   const userId = randomUUID();

//   await query(
//     `
//             INSERT INTO users (name, username, email, password, phone, created_at)
//             VALUES ($1, $2, $3, $4, $5, $6)
//             ON CONFLICT (email) DO NOTHING;
//         `,
//     ["aaa", "aaa", "aaa@aa.a", hashedPassword, "01918283717", new Date().toISOString()]
//   );

//   console.log("Sample user seeded.");
// }

// async function seedChats() {
//   console.log("Creating user table if it does not exist...");
//   await query(`
//             CREATE TABLE IF NOT EXISTS chats (
//                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//                user_id UUID REFERENCES users(id),
//                title VARCHAR(100) NOT NULL,
//                created_at TIMESTAMP DEFAULT NOW(),
//                updated_at TIMESTAMP DEFAULT NOW()
//             );
//           `);
// }

// async function seedMessages() {
//   console.log("Creating messages table if it does not exist...");
//   await query(`
//             CREATE TABLE IF NOT EXISTS messages (
//                sequence  SERIAL PRIMARY KEY,
//                id UUID UNIQUE DEFAULT gen_random_uuid(),
//                chat_id UUID REFERENCES chats(id),
//                user_id UUID REFERENCES users(id),
//                content TEXT NOT NULL,
//                role VARCHAR(10) NOT NULL CHECK (role IN ('user', 'model')),
//                created_at TIMESTAMP DEFAULT NOW(),
//                updated_at TIMESTAMP DEFAULT NOW()
//             );
//           `);
// }

export async function GET() {
  // Call the seedUsers function
  console.log("Seeding tables...");

  try {
    // await seedUsers();
    // await seedChats();
    // await seedMessages();
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
