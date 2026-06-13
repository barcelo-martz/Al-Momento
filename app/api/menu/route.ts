import { prisma } from "@/lib/db";
import { seedDb } from "@/lib/seed";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await seedDb();
  const platos = await prisma.plato.findMany();
  return NextResponse.json(platos);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const nuevo = await prisma.plato.create({ data: body });
  return NextResponse.json(nuevo, { status: 201 });
}
