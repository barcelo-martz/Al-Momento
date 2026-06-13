import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { pinActual, pinNuevo, pinConfirmar } = await req.json();

  if (pinNuevo !== pinConfirmar)
    return NextResponse.json(
      { error: "Los PINs no coinciden" },
      { status: 400 },
    );
  if (pinNuevo.length < 4)
    return NextResponse.json(
      { error: "El PIN debe tener al menos 4 dígitos" },
      { status: 400 },
    );

  const config = await prisma.config.findUnique({
    where: { key: "admin_pin" },
  });
  if (pinActual !== (config?.value ?? "1234"))
    return NextResponse.json(
      { error: "PIN actual incorrecto" },
      { status: 401 },
    );

  await prisma.config.update({
    where: { key: "admin_pin" },
    data: { value: pinNuevo },
  });
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_auth", pinNuevo, {
    httpOnly: true,
    maxAge: 86400,
    path: "/",
  });
  return res;
}
