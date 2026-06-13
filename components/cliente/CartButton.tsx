"use client";

import { useCart } from "@/context/CartContext";

export function CartButton({ onClick }: { onClick: () => void }) {
  const { count, total } = useCart();

  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-orange-600 text-white p-4 rounded-2xl"
    >
      🛒 {count} · ${total.toFixed(2)}
    </button>
  );
}
