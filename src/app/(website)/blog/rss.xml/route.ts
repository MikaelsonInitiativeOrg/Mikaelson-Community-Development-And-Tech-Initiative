import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL("/feed.xml", request.url);
  return NextResponse.redirect(url, { status: 301 });
}
