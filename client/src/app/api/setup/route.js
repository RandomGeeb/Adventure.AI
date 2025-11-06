import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const sessionId = req.headers.get("x-session-id");

    const response = await fetch(
      "https://gemini-adventure-api.fly.dev/story/setup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Session-Id": sessionId,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (err) {
    console.error("Proxy error:", err);
    return NextResponse.json({ error: "Proxy failed" }, { status: 500 });
  }
}
