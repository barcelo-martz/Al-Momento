import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { pin } = await req.json();
  const config = await prisma.config.findUnique({
    where: { key: "admin_pin" },
  });
  const pinReal = config?.value ?? "1234";

  if (pin !== pinReal) {
    return NextResponse.json({ error: "PIN incorrecto" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_auth", pinReal, {
    httpOnly: true,
    maxAge: 86400,
    path: "/",
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete("admin_auth");
  return res;
}
