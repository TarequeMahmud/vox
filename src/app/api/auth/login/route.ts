import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    console.log(email, password);

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Mock user authentication logic
    const mockUser = {
      email: "aaa@aa.a",
      password: "aaaaaa",
    };

    if (email === mockUser.email && password === mockUser.password) {
      const token = "mock-jwt-token";

      return NextResponse.json(
        { message: "Login successful", token },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
