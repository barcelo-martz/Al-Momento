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

export async function GET() {
  const pedidos = await prisma.pedido.findMany({
    where: { status: { not: "cerrado" } },
    include: { items: true },
    orderBy: { date: "desc" },
  });
  return NextResponse.json(
    sanitize(pedidos.map((p) => ({ ...p, table: p.tableNumber }))),
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const existente = await prisma.pedido.findFirst({
    where: { tableNumber: body.table, status: { not: "cerrado" } },
    include: { items: true },
  });

  if (existente) {
    for (const item of body.items) {
      const itemExistente = existente.items.find(
        (i: any) => i.name === item.name,
      );
      if (itemExistente) {
        await prisma.pedidoItem.update({
          where: { id: itemExistente.id },
          data: { quantity: { increment: item.quantity } },
        });
      } else {
        await prisma.pedidoItem.create({
          data: {
            pedidoId: existente.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          },
        });
      }
    }
    const actualizado = await prisma.pedido.update({
      where: { id: existente.id },
      data: { total: { increment: body.total }, status: "pendiente" },
      include: { items: true },
    });
    await prisma.mesa.upsert({
      where: { number: body.table },
      update: { status: "pendiente" },
      create: { number: body.table, status: "pendiente" },
    });
    broadcast(
      "pedido-actualizado",
      sanitize({
        ...actualizado,
        table: actualizado.tableNumber,
      }),
    );
    return NextResponse.json({
      ...sanitize({
        ...actualizado,
        table: actualizado.tableNumber,
      }),
    });
  }

  const nuevo = await prisma.pedido.create({
    data: {
      tableNumber: body.table,
      total: body.total,
      status: "pendiente",
      date: BigInt(Date.now()),
      items: {
        create: body.items.map((i: any) => ({
          name: i.name,
          quantity: i.quantity,
          price: i.price,
        })),
      },
    },
    include: { items: true },
  });
  await prisma.mesa.upsert({
    where: { number: body.table },
    update: { status: "pendiente" },
    create: { number: body.table, status: "pendiente" },
  });
  broadcast("nuevo-pedido", sanitize({ ...nuevo, table: nuevo.tableNumber }));
  return NextResponse.json(sanitize({ ...nuevo, table: nuevo.tableNumber }), {
    status: 201,
  });
}
