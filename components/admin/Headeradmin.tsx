"use client";
import { useEffect, useState } from "react";

export default function Headeradmin() {
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then(setData);
  }, []);

  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const cerrarSesion = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    window.location.href = "/admin/login";
  };
  return (
    <header className="flex justify-between items-center px-container-margin h-16 w-full z-50 bg-surface dark:bg-surface-dim shadow-[0px_4px_20px_rgba(192,86,33,0.08)] sticky top-0">
      <div className="flex items-center gap-xs">
        <span
          className="material-symbols-outlined text-primary text-2xl"
          data-icon="restaurant"
        >
          restaurant
        </span>
        <span className="font-headline-lg text-headline-lg text-primary tracking-tight">
          MesaYa
        </span>
      </div>
      <div className="hidden md:flex items-center gap-lg">
        <div className="flex flex-col items-end">
          <span
            className="font-label-bold text-label-bold text-on-surface-variant text-[1.2rem]"
            id="current-time"
          >
            {currentTime.toLocaleTimeString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          <span className="text-[12px] text-outline">
            {currentTime.toLocaleDateString(undefined, {
              day: "numeric",
              month: "long",
              weekday: "long",
              year: "numeric",
            })}
          </span>
        </div>
        <div className="bg-primary-container text-on-primary-container px-md py-xs rounded-xl flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-wider font-bold opacity-80">
            Total del día
          </span>
          <span className="font-price-display text-price-display">
            ${(data?.totalHoy ?? 0).toFixed(2)}
          </span>
        </div>
        <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center border border-outline-variant overflow-hidden">
          <img
            alt="Admin"
            data-alt="A professional headshot of a restaurant manager in a minimalist, sun-drenched bistro setting. The lighting is warm and natural, reflecting the brand's terracotta and cream color palette. The manager has a welcoming and efficient expression, fitting the modern culinary industry aesthetic. High-quality digital photography with a soft bokeh background of a clean, modern kitchen."
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0gG7H3cZC-EhKn8iE7wBZJjGvOfa97cB5oCut8n2aoWH5l41N7aFOUqrfTX7IFeuqVSfVrDufyXwCUmhTHVpoajk3csDFcyWqX_hrYpvPjoEIupr69p3VLQa3JQ4jjP_W3YjxrPXDiSoVRRfIl3Ro6QrYLzPT_tj5LW3owfBdus6ifxNnOV6aT6u9llFmtgOYNcOra9P-NVyKwSBjLZpHwXd9XgO5zNTV16otZ7gOIEiDnacJLBhUShUT4EMBVg65uZDo52AHi_0f"
          />
        </div>
        <button onClick={cerrarSesion} className="...">
          <span className="material-symbols-outlined">logout</span>
        </button>
      </div>
    </header>
  );
}
