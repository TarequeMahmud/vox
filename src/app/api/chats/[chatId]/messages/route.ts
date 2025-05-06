import { NextResponse, NextRequest } from "next/server";
import { query } from "@/lib/db";
import { DatabaseError } from "pg";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const { userMessage, modelMessage } = await request.json();
    const { pathname } = new URL(request.url);
    const chatId = pathname.split("/")[3];
    const uuidRegex =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

    if (!uuidRegex.test(chatId)) {
      return NextResponse.json(
        { error: "Invalid chat ID format" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();

    if (!userMessage.text || !modelMessage.text) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY!
    ) as JwtPayload;

    const user_id = payload.id;

    try {
      const insertMessages = await query(
        `INSERT INTO messages (chat_id, user_id, content, role)
         VALUES ($1, $2, $3, 'user'), ($4, $5, $6, 'model')
         RETURNING *`,
        [chatId, user_id, userMessage.text, chatId, user_id, modelMessage.text]
      );
      if (!insertMessages || insertMessages.rowCount === 0) {
        return NextResponse.json(
          { error: "Failed to save message" },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { message: "Message saved successfully", data: insertMessages.rows[0] },
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

        return NextResponse.json(
          { error: "Failed to save message to database" },
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

export async function GET(request: Request) {
  try {
    const { pathname } = new URL(request.url);
    const chatId = pathname.split("/")[3];
    const uuidRegex =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

    if (!uuidRegex.test(chatId)) {
      return NextResponse.json(
        { error: "Invalid chat ID format" },
        { status: 400 }
      );
    }

    try {
      const getMessages = await query(
        "SELECT * FROM messages WHERE chat_id = $1 ORDER BY sequence ASC",
        [chatId]
      );

      if (!getMessages || getMessages.rowCount === 0) {
        return NextResponse.json(
          { error: "No messages found for this chat" },
          { status: 404 }
        );
      }

      const responseArray = getMessages.rows.map((items) => {
        return {
          id: items.id,
          role: items.role,
          content: items.content,
        };
      });

      return NextResponse.json(responseArray, { status: 200 });
    } catch (dbError) {
      if (dbError instanceof DatabaseError) {
        console.error("Database error:", dbError);
        if (dbError.code === "ETIMEDOUT") {
          return NextResponse.json(
            { error: "Database connection timed out" },
            { status: 500 }
          );
        }

        return NextResponse.json(
          { error: "Failed to retrieve messages from database" },
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
