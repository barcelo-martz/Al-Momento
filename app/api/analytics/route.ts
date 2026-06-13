import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fechaParam = searchParams.get("fecha");
  const fecha = fechaParam ? new Date(fechaParam) : new Date();
  fecha.setHours(0, 0, 0, 0);
  const inicioDia = BigInt(fecha.getTime());
  const finDia = BigInt(fecha.getTime() + 86400000);
  const pagina = parseInt(searchParams.get("pagina") ?? "1");
  const porPagina = 10;

  const cerradosHoy = await prisma.pedido.findMany({
    where: { status: "cerrado", date: { gte: inicioDia, lt: finDia } },
    include: { items: true },
  });

  const totalHoy = cerradosHoy.reduce((acc, p) => acc + p.total, 0);
  const mesasAtendidas = cerradosHoy.length;
  const promedio = mesasAtendidas > 0 ? totalHoy / mesasAtendidas : 0;

  const conteo: Record<string, number> = {};
  cerradosHoy.forEach((p) =>
    p.items.forEach((i) => {
      conteo[i.name] = (conteo[i.name] || 0) + i.quantity;
    }),
  );
  const top5 = Object.entries(conteo)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, total]) => ({ name, total }));

  const ventasPorHora: Record<number, number> = {};
  cerradosHoy.forEach((p) => {
    const hora = new Date(Number(p.date)).getHours();
    ventasPorHora[hora] = (ventasPorHora[hora] || 0) + p.total;
  });

  const totalRegistros = await prisma.pedido.count({
    where: { status: "cerrado" },
  });
  const historial = await prisma.pedido.findMany({
    where: { status: "cerrado" },
    include: { items: true },
    orderBy: { date: "desc" },
    skip: (pagina - 1) * porPagina,
    take: porPagina,
  });

  return NextResponse.json({
    totalHoy,
    mesasAtendidas,
    promedio,
    topPlato: top5[0]?.name ?? "Sin datos",
    topPlatoUnidades: top5[0]?.total ?? 0,
    top5,
    ventasPorHora: Object.entries(ventasPorHora).map(([hora, total]) => ({
      hora: parseInt(hora),
      total,
    })),
    historial: historial.map((p) => ({
      ...p,
      table: p.tableNumber,
      date: Number(p.date),
      horaCierre: p.horaCierre ? Number(p.horaCierre) : null,
    })),
    totalRegistros,
    totalPaginas: Math.ceil(totalRegistros / porPagina),
    paginaActual: pagina,
  });
}
