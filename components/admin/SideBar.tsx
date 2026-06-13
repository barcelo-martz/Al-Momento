"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function SideBar() {
  const [mesas, setMesas] = useState(0);
  const [ocupadas, setOcupadas] = useState(0);

  useEffect(() => {
    fetch("/api/mesas")
      .then((res) => res.json())
      .then((data) => {
        setMesas(data.total);
        setOcupadas(data.ocupadas);
      });
  }, []);

  const linksSidebar = [
    { name: "Mesas", icon: "table_restaurant", href: "/admin/mesas" },
    { name: "Menu Editor", icon: "edit_note", href: "/admin/menu" },
    { name: "Analytics", icon: "analytics", href: "/admin/analytics" },
    { name: "Orders", icon: "dashboard", href: "/admin/orders" },
    { name: "Configuración", icon: "settings", href: "/admin/configuracion" },
  ];
  const pathname = usePathname();
  return (
    <aside className="fixed left-0 top-16 h-[calc(100%-64px)] z-40 hidden md:flex flex-col bg-surface-container-low border-r border-outline-variant rounded-r-xl w-70 p-md shadow-lg">
      <div className="mb-lg">
        <h2 className="font-headline-md text-headline-md text-primary mb-md">
          Admin Panel
        </h2>
        <nav className="flex flex-col gap-6">
          {linksSidebar.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-sm rounded-full px-md py-sm transition-colors duration-150 ${
                pathname === link.href
                  ? "bg-secondary-container text-on-secondary-container hover:bg-surface-container-highest"
                  : "bg-surface-container-high text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined" data-icon={link.icon}>
                {link.icon}
              </span>
              <span className="font-label-bold text-label-bold">
                {link.name}
              </span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto border-t border-outline-variant pt-md">
        <div className="bg-surface-container p-sm rounded-xl">
          <p className="text-xs text-on-surface-variant font-medium mb-1">
            Capacidad Actual
          </p>
          <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full"
              style={{ width: `${(ocupadas / mesas) * 100}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-outline mt-2">
            {ocupadas} de {mesas} mesas ocupadas
          </p>
        </div>
      </div>
    </aside>
  );
}
