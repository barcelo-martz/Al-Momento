"use client";

import { useEffect, useState } from "react";

interface AnalyticsData {
  totalHoy: number;
  mesasAtendidas: number;
  promedio: number;
  topPlato: string;
  topPlatoUnidades: number;
  top5: { name: string; total: number }[];
  ventasPorHora: { hora: number; total: number }[];
  historial: any[];
}

const HORAS = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [detalleModal, setDetalleModal] = useState<any | null>(null);

  const [fecha, setFecha] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    fetch(`/api/analytics?fecha=${fecha}&pagina=${pagina}`)
      .then((r) => r.json())
      .then(setData);
  }, [fecha, pagina]);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then(setData);
  }, []);

  const maxVenta = data?.ventasPorHora.length
    ? Math.max(...data.ventasPorHora.map((v) => v.total), 1)
    : 1;

  const getVentaHora = (hora: number) =>
    data?.ventasPorHora.find((v) => v.hora === hora)?.total ?? 0;

  const maxTop5 = data?.top5?.[0]?.total ?? 1;

  const currentTime = new Date();

  return (
    <main className="pt-5 pb-12 md:pl-72 px-container-margin min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-lg gap-md">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
            Panel de Análisis
          </h1>
          <p className="text-on-surface-variant">
            Revisa el rendimiento de tu restaurante en tiempo real.
          </p>
        </div>
        <div className="bg-surface-container-high rounded-lg px-4 py-2 flex items-center gap-sm">
          <span className="material-symbols-outlined text-sm">event</span>
          <span className="text-sm font-label-bold">
            hoy,{" "}
            {currentTime.toLocaleDateString(undefined, {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Cards resumen */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-lg">
        <div className="bg-white p-md rounded-xl card-shadow border-l-4 border-primary">
          <div className="flex justify-between items-start mb-sm">
            <p className="text-on-surface-variant text-sm font-label-bold uppercase tracking-wider">
              Total del Día
            </p>
            <span className="material-symbols-outlined text-primary bg-primary-fixed p-1 rounded">
              payments
            </span>
          </div>
          <h3 className="font-headline-lg text-headline-lg text-primary">
            ${(data?.totalHoy ?? 0).toFixed(2)}
          </h3>
        </div>
        <div className="bg-white p-md rounded-xl card-shadow border-l-4 border-tertiary">
          <div className="flex justify-between items-start mb-sm">
            <p className="text-on-surface-variant text-sm font-label-bold uppercase tracking-wider">
              Mesas Atendidas
            </p>
            <span className="material-symbols-outlined text-tertiary bg-tertiary-fixed p-1 rounded">
              table_restaurant
            </span>
          </div>
          <h3 className="font-headline-lg text-headline-lg text-on-surface">
            {data?.mesasAtendidas ?? 0}
          </h3>
        </div>
        <div className="bg-white p-md rounded-xl card-shadow border-l-4 border-secondary">
          <div className="flex justify-between items-start mb-sm">
            <p className="text-on-surface-variant text-sm font-label-bold uppercase tracking-wider">
              Promedio Mesa
            </p>
            <span className="material-symbols-outlined text-secondary bg-secondary-fixed p-1 rounded">
              receipt_long
            </span>
          </div>
          <h3 className="font-headline-lg text-headline-lg text-on-surface">
            ${(data?.promedio ?? 0).toFixed(2)}
          </h3>
        </div>
        <div className="bg-white p-md rounded-xl card-shadow border-l-4 border-primary-container">
          <div className="flex justify-between items-start mb-sm">
            <p className="text-on-surface-variant text-sm font-label-bold uppercase tracking-wider">
              Más Vendido
            </p>
            <span className="material-symbols-outlined text-primary-container bg-primary-fixed p-1 rounded">
              star
            </span>
          </div>
          <h3 className="font-headline-md text-headline-md text-on-surface">
            {data?.topPlato ?? "—"}
          </h3>
          <p className="text-xs text-on-surface-variant mt-xs">
            {data?.topPlatoUnidades ?? 0} unidades
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg mb-lg">
        {/* Gráfico ventas por hora */}
        <div className="lg:col-span-2 bg-white p-md rounded-2xl card-shadow flex flex-col">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-md">
            Ventas por Hora
          </h2>
          <div className="relative h-64 w-full flex items-end gap-1 pt-4 px-2">
            {HORAS.map((hora) => {
              const venta = getVentaHora(hora);
              const altura =
                maxVenta > 0
                  ? Math.max((venta / maxVenta) * 100, venta > 0 ? 5 : 0)
                  : 0;
              return (
                <div
                  key={hora}
                  className="flex-1 flex flex-col items-center group cursor-pointer"
                >
                  <span className="text-[9px] text-primary font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    ${venta.toFixed(0)}
                  </span>
                  <div
                    className={`w-full rounded-t-lg transition-all duration-500 group-hover:brightness-110 ${venta > 0 ? "bg-primary-container" : "bg-surface-container"}`}
                    style={{ height: `${Math.max(altura, 2)}%` }}
                  />
                  <span className="text-[9px] mt-1 text-on-surface-variant">
                    {hora > 12
                      ? `${hora - 12}pm`
                      : hora === 12
                        ? "12pm"
                        : `${hora}am`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top 5 platos */}
        <div className="bg-white p-md rounded-2xl card-shadow">
          <div className="flex items-center justify-between mb-md">
            <h2 className="font-headline-md text-headline-md text-on-surface">
              Top 5 Platos
            </h2>
            <span className="material-symbols-outlined text-primary-fixed-dim">
              award_star
            </span>
          </div>
          <div className="space-y-sm">
            {data?.top5.length ? (
              data.top5.map((plato, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-xs">
                    <span className="font-label-bold">{plato.name}</span>
                    <span className="text-on-surface-variant">
                      {plato.total} ventas (
                      {Math.round((plato.total / maxTop5) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(plato.total / maxTop5) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-on-surface-variant text-sm text-center py-lg">
                Sin ventas hoy
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Historial cuentas cerradas */}
      <section className="bg-white rounded-2xl card-shadow overflow-hidden">
        <div className="px-md py-md border-b border-outline-variant flex justify-between items-center">
          <h2 className="font-headline-md text-headline-md text-on-surface">
            Historial de Cuentas
          </h2>
          <span className="text-xs font-label-bold text-on-surface-variant">
            Últimas 10 cerradas
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low border-b border-outline-variant">
              <tr>
                <th className="px-md py-4 font-label-bold text-sm text-on-surface-variant">
                  Mesa
                </th>
                <th className="px-md py-4 font-label-bold text-sm text-on-surface-variant">
                  Hora de Cierre
                </th>
                <th className="px-md py-4 font-label-bold text-sm text-on-surface-variant">
                  Ítems
                </th>
                <th className="px-md py-4 font-label-bold text-sm text-on-surface-variant">
                  Total
                </th>
                <th className="px-md py-4 font-label-bold text-sm text-on-surface-variant text-right">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {data?.historial.length ? (
                data.historial.map((p, i) => (
                  <tr
                    key={i}
                    className="hover:bg-surface-container-low transition-colors"
                  >
                    <td className="px-md py-4">
                      <div className="flex items-center gap-xs">
                        <span className="w-2 h-2 rounded-full bg-tertiary" />
                        <span className="font-medium text-on-surface">
                          Mesa {p.table_number ?? p.table}
                        </span>
                      </div>
                    </td>
                    <td className="px-md py-4 text-on-surface-variant">
                      <div className="flex gap-sm items-center">
                        <input
                          type="date"
                          value={fecha}
                          max={new Date().toISOString().split("T")[0]}
                          onChange={(e) => {
                            setFecha(e.target.value);
                            setPagina(1);
                          }}
                          className="bg-surface-container-high rounded-lg px-4 py-2 text-sm font-label-bold border-0 outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                        />
                      </div>
                    </td>
                    <td className="px-md py-4">
                      <div className="flex items-center gap-xs">
                        <div className="w-6 h-6 rounded-full bg-primary-container text-[10px] text-white flex items-center justify-center">
                          {p.items?.length ?? 0}
                        </div>
                        <span className="text-xs text-on-surface-variant truncate max-w-[120px]">
                          {p.items?.map((it: any) => it.name).join(", ")}
                        </span>
                      </div>
                    </td>
                    <td className="px-md py-4 font-price-display text-primary">
                      ${p.total?.toFixed(2)}
                    </td>
                    <td className="px-md py-4 text-right">
                      <button
                        onClick={() => setDetalleModal(p)}
                        className="text-secondary font-label-bold text-sm px-4 py-1.5 rounded-lg border border-secondary hover:bg-secondary hover:text-white transition-all"
                      >
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-md py-lg text-center text-on-surface-variant"
                  >
                    No hay cuentas cerradas hoy
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="p-md bg-surface-container-lowest flex justify-center">
            <nav className="flex gap-2 items-center">
              <button
                onClick={() => setPagina((p) => Math.max(1, p - 1))}
                disabled={pagina === 1}
                className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container text-on-surface-variant disabled:opacity-40"
              >
                <span className="material-symbols-outlined text-sm">
                  chevron_left
                </span>
              </button>
              {Array.from(
                { length: data?.totalPaginas ?? 1 },
                (_, i) => i + 1,
              ).map((p) => (
                <button
                  key={p}
                  onClick={() => setPagina(p)}
                  className={`w-8 h-8 flex items-center justify-center rounded text-xs font-bold transition-colors ${
                    p === pagina
                      ? "bg-primary text-white"
                      : "border border-outline-variant hover:bg-surface-container"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() =>
                  setPagina((p) => Math.min(data?.totalPaginas ?? 1, p + 1))
                }
                disabled={pagina === (data?.totalPaginas ?? 1)}
                className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container text-on-surface-variant disabled:opacity-40"
              >
                <span className="material-symbols-outlined text-sm">
                  chevron_right
                </span>
              </button>
            </nav>
          </div>
        </div>
      </section>

      {/* Modal detalle */}
      {detalleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
          <div className="bg-white rounded-2xl shadow-2xl w-140 p-lg">
            <div className="flex justify-between items-center mb-md">
              <h3 className="font-headline-md text-on-surface">
                Mesa {detalleModal.table_number ?? detalleModal.table}
              </h3>
              <button
                onClick={() => setDetalleModal(null)}
                className="material-symbols-outlined text-on-surface-variant"
              >
                close
              </button>
            </div>
            <div className="space-y-sm mb-md">
              {detalleModal.items?.map((item: any, i: number) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>
                    {item.quantity}x {item.name}
                  </span>
                  <span className="font-label-bold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-outline-variant pt-sm flex justify-between font-headline-md text-primary">
              <span>Total</span>
              <span>${detalleModal.total?.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
