"use client";

import { Mesa, Pedido } from "@/lib/types";
import { useEffect, useState } from "react";

export default function MesasAdminPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [mesas, setMesas] = useState<Mesa[]>([]);

  const cargarDatos = async () => {
    const [resMesas, resPedidos] = await Promise.all([
      fetch("/api/mesas"),
      fetch("/api/pedidos"),
    ]);
    const dataMesas = await resMesas.json();
    const dataPedidos = await resPedidos.json();
    setMesas(dataMesas);
    setPedidos(dataPedidos);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    const es = new EventSource("/api/events");
    es.addEventListener("nuevo-pedido", () => cargarDatos());
    es.addEventListener("pedido-actualizado", () => cargarDatos());
    es.addEventListener("cuenta-cerrada", () => cargarDatos());
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

  const getPedidoMesa = (numero: number) =>
    pedidos.find((p) => p.table === numero);

  // Combinar mesas de DB con mesas que tienen pedidos activos
  const todasLasMesas = Array.from(
    new Set([...mesas.map((m) => m.number), ...pedidos.map((p) => p.table)]),
  ).sort((a, b) => a - b);

  return (
    <main className="flex-1 ml-0 md:ml-[280px] p-container-margin overflow-y-auto bg-background">
      <div className="max-w-[1200px] mx-auto">
        <header className="flex justify-between items-end mb-lg">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">
              Estado de Mesas
            </h1>
            <p className="font-body-md text-on-surface-variant">
              Gestión en tiempo real del salón principal
            </p>
          </div>
          <div className="flex gap-sm">
            {[
              { color: "bg-secondary-container", label: "Pendiente" },
              { color: "bg-tertiary", label: "Listo" },
              { color: "bg-outline-variant", label: "Libre" },
            ].map(({ color, label }) => (
              <div
                key={label}
                className="flex items-center gap-xs px-sm py-xs bg-surface-container-high rounded-full border border-outline-variant"
              >
                <span className={`w-3 h-3 rounded-full ${color}`} />
                <span className="text-xs font-label-bold">{label}</span>
              </div>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {todasLasMesas.map((numero) => {
            const pedido = getPedidoMesa(numero);
            const mesa = mesas.find((m) => m.number === numero);
            const status = pedido?.status ?? mesa?.status ?? "libre";

            if (status === "libre" || !pedido) {
              return (
                <div
                  key={numero}
                  className="bg-surface-container-low rounded-xl border border-outline-variant flex flex-col h-full items-center justify-center min-h-[260px] opacity-70 hover:opacity-100 transition-opacity"
                >
                  <span className="text-outline font-headline-lg text-[48px] font-bold leading-none mb-2">
                    {String(numero).padStart(2, "0")}
                  </span>
                  <span className="text-on-surface-variant font-label-bold tracking-[0.2em] text-lg uppercase">
                    Libre
                  </span>
                </div>
              );
            }

            const isPendiente = status === "pendiente";
            const borderClass = isPendiente
              ? "border-secondary-container shadow-[0px_4px_20px_rgba(192,86,33,0.08)]"
              : "border-tertiary shadow-[0px_4px_20px_rgba(0,108,63,0.1)]";
            const headerClass = isPendiente
              ? "bg-surface-container-low"
              : "bg-tertiary-fixed";

            return (
              <div
                key={numero}
                className={`bg-surface rounded-xl border-2 ${borderClass} flex flex-col h-full transition-all hover:scale-[1.02]`}
              >
                <div
                  className={`p-sm flex justify-between items-start border-b border-outline-variant ${headerClass} rounded-t-xl`}
                >
                  <div className="flex flex-col">
                    <span
                      className={`text-[32px] font-bold font-headline-lg leading-none ${isPendiente ? "text-secondary" : "text-tertiary"}`}
                    >
                      {String(numero).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] text-outline uppercase font-bold tracking-tighter">
                      Mesa
                    </span>
                  </div>
                  <span
                    className={`px-sm py-xs text-[11px] font-bold rounded-full uppercase ${isPendiente ? "bg-orange-100 text-secondary" : "bg-tertiary text-on-tertiary animate-pulse"}`}
                  >
                    {isPendiente ? "Pendiente" : "Listo"}
                  </span>
                </div>

                <div className="p-sm flex-1">
                  <ul className="space-y-sm mb-md">
                    {pedido.items.map((item, i) => (
                      <li
                        key={i}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-on-surface font-medium">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="text-on-surface-variant font-mono">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-sm border-t border-dashed border-outline-variant flex justify-between items-center">
                    <span className="text-xs font-label-bold text-on-surface-variant">
                      Subtotal
                    </span>
                    <span
                      className={`font-price-display text-price-display ${isPendiente ? "text-primary" : "text-tertiary"}`}
                    >
                      ${pedido.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div
                  className={`p-sm grid gap-xs ${isPendiente ? "grid-cols-2" : "grid-cols-1"}`}
                >
                  {isPendiente && (
                    <button
                      onClick={() => marcarListo(pedido.id)}
                      className="bg-primary text-on-primary py-xs px-xs rounded-lg text-[11px] font-bold uppercase transition-transform active:scale-95"
                    >
                      Marcar Listo
                    </button>
                  )}
                  <button
                    onClick={() => cerrarCuenta(pedido.id)}
                    className={`py-xs px-xs rounded-lg text-[11px] font-bold uppercase transition-transform active:scale-95 ${isPendiente ? "bg-surface-variant text-on-surface-variant border border-outline-variant" : "bg-tertiary text-on-tertiary"}`}
                  >
                    {isPendiente ? "Cerrar Cuenta" : "Entregado"}
                  </button>
                </div>
              </div>
            );
          })}

          {todasLasMesas.length === 0 && (
            <div className="col-span-4 text-center py-lg text-on-surface-variant">
              No hay mesas activas
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
