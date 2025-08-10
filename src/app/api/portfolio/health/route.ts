import { NextResponse } from "next/server";

// A simple health check endpoint
export async function GET() {
  return NextResponse.json({ status: "ok" });
}