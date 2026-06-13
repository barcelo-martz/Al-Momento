"use client";

import { Product } from "@/lib/types";
import { useEffect, useRef, useState } from "react";

export default function MenuAdminPage() {
  const [menu, setMenu] = useState<Product[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<Product | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "Entradas",
    available: true,
    image: "",
  });
  const [dragOver, setDragOver] = useState(false);
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");

  const categorias = [
    "Todas",
    ...Array.from(new Set(menu.map((p) => p.category))),
  ];

  const menuFiltrado = menu.filter((p) => {
    const matchCategoria =
      categoriaFiltro === "Todas" || p.category === categoriaFiltro;
    const matchBusqueda = p.name.toLowerCase().includes(busqueda.toLowerCase());
    return matchCategoria && matchBusqueda;
  });

  const cargarMenu = async () => {
    const res = await fetch("/api/menu");
    const data = await res.json();
    setMenu(
      data.map((p: any) => ({
        ...p,
        available: p.available === 1 || p.available === true,
      })),
    );
  };

  const subirImagen = async (file: File) => {
    setSubiendoImagen(true);
    setDragOver(false);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setForm((prev) => ({ ...prev, image: data.url }));
    } catch (err) {
      console.error("Error subiendo imagen:", err);
    } finally {
      setSubiendoImagen(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) subirImagen(file);
  };

  useEffect(() => {
    cargarMenu();
  }, []);

  const abrirModal = (plato?: Product) => {
    if (plato) {
      setEditando(plato);
      setForm({
        name: plato.name,
        description: plato.description,
        price: String(plato.price),
        category: plato.category,
        available: plato.available,
        image: plato.image,
      });
    } else {
      setEditando(null);
      setForm({
        name: "",
        description: "",
        price: "",
        category: "Entradas",
        available: true,
        image: "",
      });
    }
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setEditando(null);
  };

  const guardarPlato = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { ...form, price: parseFloat(form.price) };
    if (editando) {
      await fetch(`/api/menu/${editando.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }
    cerrarModal();
    cargarMenu();
  };

  const eliminarPlato = async (id: string) => {
    if (!confirm("¿Eliminar este plato?")) return;
    await fetch(`/api/menu/${id}`, { method: "DELETE" });
    cargarMenu();
  };

  const toggleDisponible = async (plato: Product) => {
    await fetch(`/api/menu/${plato.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ available: plato.available ? 0 : 1 }),
    });
    cargarMenu();
  };

  return (
    <>
      <main className="pt-6 pb-20 px-container-margin max-w-300 mx-auto md:ml-[280px]">
        <div className="flex justify-between items-end mb-lg">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              Gestión de Menú
            </h2>
            <p className="text-on-surface-variant">
              Personaliza y actualiza los platos de tu carta en tiempo real.
            </p>
          </div>
          <button
            className="flex items-center gap-xs bg-primary text-on-primary px-md py-3 rounded-xl font-label-bold shadow-lg hover:bg-primary-container transition-all active:scale-95"
            onClick={() => abrirModal()}
          >
            <span className="material-symbols-outlined">add</span>
            Agregar Plato
          </button>
        </div>

        <div className="relative flex-1 mb-5 ">
          <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pr-3">
            search
          </span>
          <input
            type="text"
            placeholder="Buscar plato..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-surface-container-low border-2 border-surface-container rounded-xl pl-4 pr-md py-sm focus:border-primary outline-none transition-colors text-sm"
          />
        </div>

        <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(192,86,33,0.08)] overflow-hidden border border-surface-container">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="px-md py-4 font-label-bold text-on-surface-variant uppercase tracking-wider">
                    Imagen
                  </th>
                  <th className="px-md py-4 font-label-bold text-on-surface-variant uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-md py-4 font-label-bold text-on-surface-variant uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-md py-4 font-label-bold text-on-surface-variant uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-md py-4 font-label-bold text-on-surface-variant uppercase tracking-wider">
                    <div className="relative inline-block">
                      <button
                        type="button"
                        className="flex items-center gap-1 font-label-bold text-on-surface-variant uppercase tracking-wider text-sm hover:text-on-surface transition-colors"
                        onClick={() => setDropdownOpen((v) => !v)}
                      >
                        Categoría
                        <span className="material-symbols-outlined text-base">
                          {dropdownOpen ? "expand_less" : "expand_more"}
                        </span>
                      </button>

                      {dropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 z-50 bg-surface-container-lowest border border-surface-container rounded-xl shadow-lg overflow-hidden min-w-[160px]">
                          {categorias.map((c) => (
                            <button
                              key={c}
                              type="button"
                              className={`w-full text-left px-md py-2 text-sm transition-colors hover:bg-surface-container
              ${categoriaFiltro === c ? "text-primary font-label-bold bg-surface-container" : "text-on-surface"}`}
                              onClick={() => {
                                setCategoriaFiltro(c);
                                setDropdownOpen(false);
                              }}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </th>
                  <th className="px-md py-4 font-label-bold text-on-surface-variant uppercase tracking-wider">
                    Disponible
                  </th>
                  <th className="px-md py-4 font-label-bold text-on-surface-variant uppercase tracking-wider text-center">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {menuFiltrado.map((plato) => (
                  <tr
                    key={plato.id}
                    className="hover:bg-surface-bright transition-colors"
                  >
                    <td className="px-md py-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-outline-variant">
                        <img
                          alt={plato.name}
                          src={plato.image}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-md py-4 font-label-bold text-on-surface">
                      {plato.name}
                    </td>
                    <td className="px-md py-4 text-sm text-on-surface-variant max-w-xs truncate">
                      {plato.description}
                    </td>
                    <td className="px-md py-4 font-price-display text-primary">
                      ${plato.price}
                    </td>
                    <td className="px-md py-4 text-on-surface">
                      {plato.category}
                    </td>
                    <td className="px-md py-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          checked={plato.available}
                          className="sr-only peer"
                          type="checkbox"
                          onChange={() => toggleDisponible(plato)}
                        />
                        <div className="w-11 h-6 bg-outline-variant peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tertiary-container"></div>
                      </label>
                    </td>
                    <td className="px-md py-4 text-center">
                      <div className="flex justify-center gap-xs">
                        {/* ✅ onClick en el button, no en el span */}
                        <button
                          className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors"
                          onClick={() => abrirModal(plato)}
                        >
                          <span className="material-symbols-outlined">
                            edit
                          </span>
                        </button>
                        <button
                          className="p-2 text-error hover:bg-error-container/20 rounded-lg transition-colors"
                          onClick={() => eliminarPlato(plato.id)}
                        >
                          <span className="material-symbols-outlined">
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ✅ Modal controlado por modalOpen, sin "hidden" hardcodeado */}
      {modalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-inverse-surface/40 backdrop-blur-sm p-6">
          <div className="bg-surface-container-lowest w-full max-w-2xl rounded-[24px] shadow-2xl overflow-hidden h-full flex flex-col">
            <div className="flex justify-between items-center px-lg py-md border-b border-surface-container">
              <h3 className="font-headline-md text-on-surface">
                {editando ? "Editar Plato" : "Agregar Nuevo Plato"}
              </h3>
              <button
                className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-high p-2 rounded-full transition-colors"
                onClick={cerrarModal}
              >
                close
              </button>
            </div>

            <form
              className="p-lg grid grid-cols-2 gap-md overflow-y-auto"
              onSubmit={guardarPlato}
            >
              <div className="col-span-2">
                <label className="block font-label-bold text-on-surface-variant mb-xs">
                  Nombre del Plato
                </label>
                <input
                  className="w-full bg-surface-container-low border-2 border-surface-container rounded-xl px-md py-sm focus:border-primary focus:ring-0 outline-none transition-colors"
                  placeholder="Ej. Tacos de Ribeye"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block font-label-bold text-on-surface-variant mb-xs">
                  Descripción Detallada
                </label>
                <textarea
                  className="w-full bg-surface-container-low border-2 border-surface-container rounded-xl px-md py-sm focus:border-primary focus:ring-0 outline-none transition-colors"
                  placeholder="Describe los ingredientes y preparación..."
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block font-label-bold text-on-surface-variant mb-xs">
                  Categoría
                </label>
                <select
                  className="w-full bg-surface-container-low border-2 border-surface-container rounded-xl px-md py-sm focus:border-primary focus:ring-0 outline-none transition-colors appearance-none"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  <option>Entradas</option>
                  <option>Platos Principales</option>
                  <option>Postres</option>
                  <option>Bebidas</option>
                </select>
              </div>
              <div>
                <label className="block font-label-bold text-on-surface-variant mb-xs">
                  Precio ($)
                </label>
                <input
                  className="w-full bg-surface-container-low border-2 border-surface-container rounded-xl px-md py-sm focus:border-primary focus:ring-0 outline-none transition-colors"
                  placeholder="0.00"
                  step="0.01"
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block font-label-bold text-on-surface-variant mb-xs">
                  Imagen del Plato
                </label>

                {/* Zona de arrastre */}
                <div
                  className={`relative border-2 border-dashed rounded-xl transition-colors cursor-pointer
      ${
        dragOver
          ? "border-primary bg-primary/5"
          : "border-surface-container hover:border-primary/50"
      }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => inputRef.current?.click()}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) subirImagen(file);
                    }}
                  />

                  {form.image ? (
                    <div className="relative">
                      <img
                        src={form.image}
                        alt="preview"
                        className="w-full h-40 object-cover rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setForm({ ...form, image: "" });
                        }}
                        className="absolute top-2 right-2 bg-error text-white rounded-full p-1"
                      >
                        <span className="material-symbols-outlined text-sm">
                          close
                        </span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 gap-2">
                      {subiendoImagen ? (
                        <span className="material-symbols-outlined text-primary text-4xl animate-spin">
                          progress_activity
                        </span>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-outline text-4xl">
                            upload_file
                          </span>
                          <p className="text-sm text-on-surface-variant">
                            Arrastra una imagen o{" "}
                            <span className="text-primary font-bold">
                              haz clic para buscar
                            </span>
                          </p>
                          <p className="text-xs text-outline">PNG, JPG, WEBP</p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-span-2 flex items-center justify-between bg-surface-container-low p-md rounded-xl border border-surface-container">
                <div>
                  <span className="block font-label-bold text-on-surface">
                    Disponibilidad Inmediata
                  </span>
                  <span className="text-xs text-on-surface-variant">
                    El plato aparecerá visible en el menú digital.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    checked={form.available}
                    className="sr-only peer"
                    type="checkbox"
                    onChange={(e) =>
                      setForm({ ...form, available: e.target.checked })
                    }
                  />
                  <div className="w-14 h-7 bg-outline-variant peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-tertiary-container"></div>
                </label>
              </div>
              <div className="col-span-2 flex justify-end gap-sm mt-md">
                <button
                  className="px-md py-3 rounded-xl font-label-bold text-on-surface-variant hover:bg-surface-container-high transition-colors"
                  onClick={cerrarModal}
                  type="button"
                >
                  Cancelar
                </button>
                <button
                  className="px-lg py-3 bg-primary text-on-primary rounded-xl font-label-bold shadow-lg hover:bg-primary-container transition-all active:scale-95"
                  type="submit"
                >
                  {editando ? "Guardar Cambios" : "Agregar Plato"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
