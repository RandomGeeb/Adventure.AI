import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    
    // Get cookies from the incoming request
    const cookieHeader = req.headers.get('cookie');

    const response = await fetch(
      "https://gemini-adventure-api.fly.dev/story/write-prompt",
      {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(cookieHeader && { "Cookie": cookieHeader })
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    // Get Set-Cookie headers from the external API response
    const setCookieHeaders = response.headers.get('set-cookie');
    
    // Create response and forward Set-Cookie headers
    const nextResponse = NextResponse.json(data, {
      status: response.status,
    });
    
    if (setCookieHeaders) {
      nextResponse.headers.set('Set-Cookie', setCookieHeaders);
    }

    return nextResponse;
  } catch (err) {
    console.error("Proxy error:", err);
    return NextResponse.json({ error: "Proxy failed" }, { status: 500 });
  }
}