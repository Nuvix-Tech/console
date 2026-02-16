import { NextResponse } from "next/server";

export async function GET() {
  const body = {
    status: "ok",
    now: new Date().toISOString(),
    uptime_seconds: Math.floor(process.uptime()),
    version: process.env.npm_package_version ?? process.env.VERSION ?? "unknown",
  };

  return NextResponse.json(body, {
    status: 200,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function HEAD() {
  return new Response(null, {
    status: 200,
    headers: { "Cache-Control": "no-store" },
  });
}
