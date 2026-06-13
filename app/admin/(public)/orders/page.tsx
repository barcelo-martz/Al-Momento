"use client";

import { Pedido } from "@/lib/types";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filtro, setFiltro] = useState<"todos" | "pendiente" | "listo">(
    "todos",
  );

  const cargarPedidos = async () => {
    const res = await fetch("/api/pedidos");
    const data = await res.json();
    setPedidos(data);
  };

  // Cargar pedidos iniciales
  useEffect(() => {
    cargarPedidos();
  }, []);

  // Escuchar eventos SSE en tiempo real
  useEffect(() => {
    const es = new EventSource("/api/events");

    es.addEventListener("nuevo-pedido", (e) => {
      const pedido = JSON.parse(e.data);
      setPedidos((prev) => [pedido, ...prev]);
    });

    es.addEventListener("pedido-actualizado", (e) => {
      const updated = JSON.parse(e.data);
      setPedidos((prev) =>
        prev.map((p) =>
          p.id === updated.id
            ? { ...updated, table: updated.table_number ?? updated.table }
            : p,
        ),
      );
    });

    es.addEventListener("cuenta-cerrada", (e) => {
      const { mesaNumber } = JSON.parse(e.data);
      setPedidos((prev) => prev.filter((p) => p.table !== mesaNumber));
    });

    return () => es.close();
  }, []);

  const marcarListo = async (id: string) => {
    await fetch(`/api/pedidos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "listo" }),
    });
  };

  const cerrarCuenta = async (id: string) => {
    await fetch(`/api/pedidos/${id}`, { method: "DELETE" });
  };

  const pedidosFiltrados = pedidos.filter((p) =>
    filtro === "todos" ? true : p.status === filtro,
  );

  const borderColor = (status: string) =>
    status === "pendiente" ? "border-error" : "border-tertiary";

  const badgeClass = (status: string) =>
    status === "pendiente"
      ? "bg-error-container text-on-error-container"
      : "bg-tertiary-fixed text-on-tertiary-fixed-variant";

  return (
    <div className="flex-1 ml-0 md:ml-[280px] p-container-margin overflow-y-auto bg-background">
      <section className="flex flex-col gap-md">
        <div className="flex items-center justify-between">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            Order Management
          </h2>
          <div className="flex gap-sm overflow-x-auto pb-2">
            {(["todos", "pendiente", "listo"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                className={`px-md py-sm rounded-full font-label-bold whitespace-nowrap transition-colors ${
                  filtro === f
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                {f === "todos"
                  ? `Todos (${pedidos.length})`
                  : f === "pendiente"
                    ? `Pendiente (${pedidos.filter((p) => p.status === "pendiente").length})`
                    : `Listo (${pedidos.filter((p) => p.status === "listo").length})`}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md mt-md">
        {pedidosFiltrados.length === 0 && (
          <div className="col-span-4 text-center py-lg text-on-surface-variant">
            No hay pedidos activos
          </div>
        )}
        {pedidosFiltrados.map((pedido) => (
          <div
            key={pedido.id}
            className={`bg-white rounded-xl custom-shadow flex flex-col p-md border-t-4 ${borderColor(pedido.status)} transition-transform hover:scale-[1.02]`}
          >
            <div className="flex justify-between items-start mb-sm">
              <div>
                <span className="font-headline-lg text-headline-lg text-on-surface leading-none">
                  {String(pedido.table).padStart(2, "0")}
                </span>
                <p className="text-xs text-on-surface-variant font-label-bold mt-1">
                  {new Date(pedido.date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <span
                className={`px-sm py-1 rounded-full text-xs font-label-bold ${badgeClass(pedido.status)}`}
              >
                {pedido.status === "pendiente" ? "Pendiente" : "Listo"}
              </span>
            </div>

            <div className="flex-grow my-sm space-y-2">
              {pedido.items.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between text-body-md text-on-surface-variant"
                >
                  <span>
                    {item.quantity}x {item.name}
                  </span>
                  <span className="font-label-bold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-outline-variant pt-sm mt-sm">
              <div className="flex justify-between items-center mb-md">
                <span className="font-label-bold text-on-surface-variant">
                  Total
                </span>
                <span className="font-headline-md text-headline-md text-primary">
                  ${pedido.total.toFixed(2)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-sm">
                {pedido.status === "pendiente" && (
                  <button
                    onClick={() => marcarListo(pedido.id)}
                    className="py-sm bg-surface-container-highest text-on-surface font-label-bold rounded-lg hover:bg-surface-container-high transition-all"
                  >
                    Marcar listo
                  </button>
                )}
                {pedido.status === "listo" && (
                  <button className="py-sm bg-tertiary-container text-on-tertiary-container font-label-bold rounded-lg flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-sm">
                      check_circle
                    </span>
                    Listo
                  </button>
                )}
                <button
                  onClick={() => cerrarCuenta(pedido.id)}
                  className="py-sm bg-primary text-on-primary font-label-bold rounded-lg shadow-sm hover:opacity-90 transition-all"
                >
                  Cerrar cuenta
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
