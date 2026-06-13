import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();
  const updated = await prisma.plato.update({ where: { id }, data: body });
  return NextResponse.json(updated);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await prisma.plato.delete({ where: { id } });
  return NextResponse.json({ deleted: true });
}
