"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (pin.length < 4) return;
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });

    if (res.ok) {
      router.push("/admin/orders");
    } else {
      setError("PIN incorrecto. Intenta de nuevo.");
      setPin("");
    }
    setLoading(false);
  };

  return (
    <div className="h-screen bg-background flex items-center justify-center px-6 w-full">
      <div className="bg-white rounded-2xl shadow-xl p-lg w-80 ">
        <div className="text-center mb-lg">
          <span className="material-symbols-outlined text-primary text-5xl">
            restaurant
          </span>
          <h1 className="font-headline-lg text-on-surface mt-sm">
            Nombre del Restaurante
          </h1>
          <p className="text-on-surface-variant text-sm mt-xs">
            Panel de Administración
          </p>
        </div>

        <div className="flex flex-col space-y-md gap-2">
          <div>
            <label className="block font-label-bold text-on-surface-variant mb-xs">
              PIN de acceso
            </label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={8}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/, ""))}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="••••"
              className="w-full bg-surface-container-low border-2 border-surface-container rounded-xl px-md py-sm text-center text-2xl tracking-[0.5em] focus:border-primary outline-none transition-colors"
            />
          </div>

          {error && (
            <p className="text-error text-sm text-center font-label-bold">
              {error}
            </p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading || pin.length < 4}
            className="w-full bg-primary text-on-primary py-sm rounded-xl font-label-bold shadow-lg disabled:opacity-50 active:scale-95 transition-all"
          >
            {loading ? "Verificando..." : "Entrar"}
          </button>
        </div>
      </div>
    </div>
  );
}
