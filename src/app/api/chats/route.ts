import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { DatabaseError } from "pg";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import predictTitle from "@/lib/predictTitle";

export async function POST(request: Request) {
  try {
    const { firstMessage, chatId } = await request.json();
    const cookieStore = await cookies();

    if (!firstMessage) {
      return NextResponse.json(
        { error: "Where is first message from user?" },
        { status: 400 }
      );
    }
    if (!chatId) {
      return NextResponse.json(
        { error: "Where is chat id for the chat?" },
        { status: 400 }
      );
    }
    //get user id from jwt token
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

    // predict a title for the chat.
    const title = await predictTitle(firstMessage);
    if (!title) {
      return NextResponse.json(
        { error: "Failed to predict title" },
        { status: 500 }
      );
    }

    try {
      const insertChat = await query(
        "INSERT INTO chats(id, user_id, title) VALUES($1, $2, $3) RETURNING *",
        [chatId, user_id, title]
      );
      const chatRow: ChatRow = insertChat.rows[0];
      const chatResponse: SingleChat = {
        date_group: "Today",
        chat: {
          id: chatRow.id,
          title: chatRow.title,
          created_at: chatRow.created_at,
        },
      };

      if (!insertChat || insertChat.rowCount === 0) {
        return NextResponse.json(
          { error: "Failed to add to archive chat" },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { message: "Chat saved", chatResponse },
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

export async function GET() {
  try {
    const cookieStore = await cookies();
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

    const id = payload.id;

    try {
      const getChats = await query(
        `
          WITH grouped_chats AS (
            SELECT *, 
              CASE
                WHEN created_at::date = CURRENT_DATE THEN 'Today'
                WHEN created_at::date = CURRENT_DATE - INTERVAL '1 day' THEN 'Yesterday'
                WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 'Last 7 Days'
                WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 'Last 30 Days'
                ELSE 'Older'
              END AS date_group
            FROM chats
            WHERE user_id = $1
          )
          SELECT * FROM grouped_chats
          ORDER BY 
            CASE
              WHEN date_group = 'Today' THEN 1
              WHEN date_group = 'Yesterday' THEN 2
              WHEN date_group = 'Last 7 Days' THEN 3
              WHEN date_group = 'Last 30 Days' THEN 4
              ELSE 5
            END,
            created_at DESC;
        `,
        [id]
      );

      if (!getChats || getChats.rowCount === 0) {
        return NextResponse.json(
          { error: "Failed to get chats" },
          { status: 500 }
        );
      }
      // provide a grouped response for the chats retrieved from the database.
      const groups: GroupedChats[] = [];

      for (const chat of getChats.rows as ChatRow[]) {
        let group = groups.find((g) => g.date_group === chat.date_group);
        if (!group) {
          group = {
            date_group: chat.date_group,
            chats: [],
          };
          groups.push(group);
        }
        group.chats.push({
          id: chat.id,
          title: chat.title,
          created_at: chat.created_at,
        });
      }

      return NextResponse.json(groups, { status: 200 });
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
