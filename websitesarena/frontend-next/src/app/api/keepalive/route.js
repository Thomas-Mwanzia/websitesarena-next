import { NextResponse } from 'next/server';

// Simple keep-alive endpoint for uptime monitors (UptimeRobot, etc.)
// GET  /api/keepalive -> 200 JSON { ok: true }
export function GET() {
  return NextResponse.json({ ok: true });
}

// Some monitors use HEAD requests — respond with 200 OK for HEAD as well
export function HEAD() {
  return new Response(null, { status: 200 });
}
