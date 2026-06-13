"use client";

import { useCart } from "@/context/CartContext";
import { CartProduct } from "@/lib/types";

export function CartItem({ item }: { item: CartProduct }) {
  const { addItem, removeItem } = useCart();

  return (
    <div className="flex justify-between">
      <div>
        <h4>{item.name}</h4>
        <span>${item.price}</span>
      </div>

      <div className="flex gap-3">
        <button onClick={() => removeItem(item.id)}>-</button>

        <span>{item.quantity}</span>

        <button onClick={() => addItem(item)}>+</button>
      </div>
    </div>
  );
}
