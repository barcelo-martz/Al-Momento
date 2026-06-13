import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const mesas = await prisma.mesa.findMany();
  return NextResponse.json(mesas);
}
