"use client";

import { CartButton } from "@/components/cliente/CartButton";
import { CartDrawer } from "@/components/cliente/CartDrawer";
import { CategoryTabs } from "@/components/cliente/CategoriesClient";
import HeaderClient from "@/components/cliente/HeaderClient";
import { ProductList } from "@/components/cliente/ProductList";
import { useCart } from "@/context/CartContext";
import { Product } from "@/lib/types";
import { use, useEffect, useMemo, useState } from "react";

export default function MesaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [search, setSearch] = useState("");
  const [menu, setMenu] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  // Cargar menú desde la API
  useEffect(() => {
    fetch("/api/menu")
      .then((res) => res.json())
      .then((data) => {
        // SQLite devuelve available como 0/1, convertir a boolean
        const parsed = data.map((p: any) => ({
          ...p,
          available: p.available === 1 || p.available === true,
        }));
        setMenu(parsed.filter((p: Product) => p.available));
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = ["Todos", ...new Set(menu.map((item) => item.category))];

  const filteredProducts = useMemo(() => {
    return menu.filter((product) => {
      const matchesCategory =
        selectedCategory === "Todos" || product.category === selectedCategory;
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, search, menu]);

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">
          progress_activity
        </span>
      </div>
    );
  }

  return (
    <>
      <header className="sticky top-0 left-0 w-full z-50 bg-surface shadow-[0px_4px_20px_rgba(192,86,33,0.08)] flex justify-between items-center px-container-margin h-16">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">
            restaurant
          </span>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight">
            MesaYA
          </h1>
        </div>
        <div className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <span className="material-symbols-outlined text-[18px]">
            table_restaurant
          </span>
          <span className="font-label-bold text-label-bold">Mesa {id}</span>
        </div>
      </header>
      <main className="container-app mb-20">
        <HeaderClient search={search} onSearchChange={setSearch} />
        <CategoryTabs
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
        <ProductList products={filteredProducts} onAdd={handleAddToCart} />
        <CartButton onClick={() => setCartOpen(true)} />
        <CartDrawer
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          mesaId={id}
        />
      </main>
    </>
  );
}
