import { prisma } from "@/lib/db";
import { broadcast } from "@/lib/sse";
import { NextRequest, NextResponse } from "next/server";

function sanitize(obj: any): any {
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === "bigint" ? Number(value) : value,
    ),
  );
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { status } = await req.json();
  const pedido = await prisma.pedido.update({
    where: { id },
    data: { status },
    include: { items: true },
  });
  if (status === "listo") {
    await prisma.mesa.update({
      where: { number: pedido.tableNumber },
      data: { status: "listo" },
    });
  }
  broadcast(
    "pedido-actualizado",
    sanitize({ ...pedido, table: pedido.tableNumber }),
  );
  return NextResponse.json(sanitize({ ...pedido, table: pedido.tableNumber }));
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const pedido = await prisma.pedido.update({
    where: { id },
    data: { status: "cerrado", horaCierre: BigInt(Date.now()) },
    include: { items: true },
  });
  await prisma.mesa.update({
    where: { number: pedido.tableNumber },
    data: { status: "libre" },
  });
  broadcast("cuenta-cerrada", sanitize({ mesaNumber: pedido.tableNumber }));
  return NextResponse.json({ closed: true });
}
