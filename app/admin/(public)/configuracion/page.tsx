"use client";

import { useState } from "react";

export default function ConfigPage() {
  const [cantidad, setCantidad] = useState(10);
  const [qrs, setQrs] = useState<{ mesa: number; qr: string }[]>([]);
  const [generando, setGenerando] = useState(false);

  // Estados del formulario PIN
  const [pinActual, setPinActual] = useState("");
  const [pinNuevo, setPinNuevo] = useState("");
  const [pinConfirmar, setPinConfirmar] = useState("");
  const [mensajePin, setMensajePin] = useState<{
    tipo: "ok" | "error";
    texto: string;
  } | null>(null);
  const [guardando, setGuardando] = useState(false);

  const cambiarPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setMensajePin(null);

    const res = await fetch("/api/auth/cambiar-pin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pinActual, pinNuevo, pinConfirmar }),
    });

    const data = await res.json();

    if (res.ok) {
      setMensajePin({ tipo: "ok", texto: "PIN cambiado correctamente" });
      setPinActual("");
      setPinNuevo("");
      setPinConfirmar("");
    } else {
      setMensajePin({ tipo: "error", texto: data.error });
    }

    setGuardando(false);
  };

  const generarQR = async () => {
    setGenerando(true);
    const res = await fetch("/api/qr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cantidad }),
    });
    const data = await res.json();
    setQrs(data.generados);
    setGenerando(false);
  };

  const imprimirTodos = () => window.print();

  return (
    <main className="md:ml-[280px] p-container-margin">
      <h1 className="font-headline-lg text-headline-lg text-on-surface mb-6 ">
        Configuración
      </h1>
      <div className="flex gap-lg flex-wrap">
        {/* Cambiar PIN */}
        <div className="bg-white rounded-2xl p-lg card-shadow w-100 h-auto">
          <h2 className="font-headline-md text-on-surface mb-sm">
            Cambiar PIN
          </h2>
          <p className="text-on-surface-variant text-sm mb-md">
            El PIN protege el acceso al panel de administración.
          </p>
          <form className="space-y-md" onSubmit={cambiarPin}>
            <div>
              <label className="block font-label-bold text-on-surface-variant mb-xs">
                PIN actual
              </label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={8}
                value={pinActual}
                onChange={(e) => setPinActual(e.target.value.replace(/\D/, ""))}
                placeholder="••••"
                className="w-full bg-surface-container-low border-2 border-surface-container rounded-xl px-md py-sm focus:border-primary outline-none transition-colors tracking-widest text-center text-xl"
                required
              />
            </div>
            <div>
              <label className="block font-label-bold text-on-surface-variant mb-xs">
                Nuevo PIN
              </label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={8}
                value={pinNuevo}
                onChange={(e) => setPinNuevo(e.target.value.replace(/\D/, ""))}
                placeholder="••••"
                className="w-full bg-surface-container-low border-2 border-surface-container rounded-xl px-md py-sm focus:border-primary outline-none transition-colors tracking-widest text-center text-xl"
                required
              />
            </div>
            <div>
              <label className="block font-label-bold text-on-surface-variant mb-xs">
                Confirmar nuevo PIN
              </label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={8}
                value={pinConfirmar}
                onChange={(e) =>
                  setPinConfirmar(e.target.value.replace(/\D/, ""))
                }
                placeholder="••••"
                className="w-full bg-surface-container-low border-2 border-surface-container rounded-xl px-md py-sm focus:border-primary outline-none transition-colors tracking-widest text-center text-xl"
                required
              />
            </div>

            {mensajePin && (
              <div
                className={`text-sm font-label-bold text-center py-sm rounded-xl ${
                  mensajePin.tipo === "ok"
                    ? "bg-tertiary-fixed text-tertiary"
                    : "bg-error-container text-error"
                }`}
              >
                {mensajePin.tipo === "ok" ? "✓ " : "✕ "}
                {mensajePin.texto}
              </div>
            )}

            <button
              type="submit"
              disabled={guardando}
              className="w-full bg-primary text-on-primary py-sm rounded-xl font-label-bold disabled:opacity-50 active:scale-95 transition-all"
            >
              {guardando ? "Guardando..." : "Cambiar PIN"}
            </button>
          </form>
        </div>

        {/* Generar QR */}
        <div className="bg-white rounded-2xl p-lg card-shadow max-w-xl mb-lg">
          <h2 className="font-headline-md text-on-surface mb-sm">
            Generar QR por Mesa
          </h2>
          <p className="text-on-surface-variant text-sm mb-md">
            Indica cuántas mesas tiene el local. Se generará un QR por cada una
            listo para imprimir.
          </p>
          <div className="flex items-center gap-md mb-md">
            <input
              type="number"
              min={1}
              max={50}
              value={cantidad}
              onChange={(e) => setCantidad(parseInt(e.target.value))}
              className="w-24 bg-surface-container-low border-2 border-surface-container rounded-xl px-md py-sm text-center font-label-bold text-xl focus:border-primary outline-none"
            />
            <span className="text-on-surface-variant">mesas</span>
            <button
              onClick={generarQR}
              disabled={generando}
              className="bg-primary text-on-primary px-md py-sm rounded-xl font-label-bold disabled:opacity-50 active:scale-95 transition-all"
            >
              {generando ? "Generando..." : "Generar QR"}
            </button>
          </div>
        </div>
      </div>

      {qrs.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-md">
            <h2 className="font-headline-md text-on-surface">
              {qrs.length} QR generados — listos para imprimir
            </h2>
            <button
              onClick={imprimirTodos}
              className="flex items-center gap-xs bg-surface-container-high px-md py-sm rounded-xl font-label-bold hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined">print</span>
              Imprimir todos
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-md print:grid-cols-4">
            {qrs.map(({ mesa, qr }) => (
              <div
                key={mesa}
                className="bg-white rounded-xl p-md flex flex-col items-center gap-sm card-shadow print:shadow-none print:border print:border-gray-200"
              >
                <img src={qr} alt={`QR Mesa ${mesa}`} className="w-32 h-32" />
                <span className="font-headline-md text-on-surface">
                  Mesa {mesa}
                </span>
                <a
                  href={qr}
                  download={`mesa-${mesa}.png`}
                  className="text-xs text-primary font-label-bold hover:underline print:hidden"
                >
                  Descargar
                </a>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
