"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  mesaId: string;
}

export function CartDrawer({ open, onClose, mesaId }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, clearCart, total } = useCart();
  const [enviando, setEnviando] = useState(false);
  const [confirmado, setConfirmado] = useState(false);

  const handleEnviarPedido = async () => {
    if (items.length === 0) return;
    setEnviando(true);

    try {
      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: parseInt(mesaId),
          items: items.map((i) => ({
            id: i.id,
            name: i.name,
            quantity: i.quantity,
            price: i.price,
          })),
          total,
        }),
      });

      if (res.ok) {
        clearCart();
        setConfirmado(true);
        setTimeout(() => {
          setConfirmado(false);
          onClose();
        }, 3000);
      }
    } catch (err) {
      console.error("Error enviando pedido:", err);
    } finally {
      setEnviando(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-90 flex justify-center items-center ">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-surface w-full h-full flex flex-col shadow-2xl">
        <div className="flex justify-between items-center px-md py-md border-b border-outline-variant">
          <h2 className="font-headline-md text-on-surface">Tu pedido</h2>
          <button
            onClick={onClose}
            className="material-symbols-outlined text-on-surface-variant"
          >
            close
          </button>
        </div>

        {confirmado ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-md px-md">
            <span className="material-symbols-outlined text-tertiary text-6xl">
              check_circle
            </span>
            <h3 className="font-headline-md text-on-surface text-center">
              ¡Pedido enviado!
            </h3>
            <p className="text-on-surface-variant text-center">
              Tu pedido está en camino. Mesa {mesaId}.
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-md py-sm space-y-sm">
              {items.length === 0 ? (
                <p className="text-on-surface-variant text-center py-lg">
                  No hay ítems en tu pedido
                </p>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center bg-surface-container-low p-sm rounded-xl"
                  >
                    <div className="flex-1">
                      <p className="font-label-bold text-on-surface">
                        {item.name}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-xs">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined text-sm">
                          remove
                        </span>
                      </button>
                      <span className="font-label-bold w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined text-sm">
                          add
                        </span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="px-md py-md border-t border-outline-variant space-y-sm">
              <div className="flex justify-between items-center">
                <span className="font-label-bold text-on-surface-variant">
                  Total
                </span>
                <span className="font-headline-md text-primary">
                  ${total.toFixed(2)}
                </span>
              </div>
              <button
                onClick={handleEnviarPedido}
                disabled={enviando || items.length === 0}
                className="w-full bg-primary text-on-primary py-sm rounded-xl font-label-bold disabled:opacity-50 active:scale-95 transition-all"
              >
                {enviando ? "Enviando..." : "Enviar pedido"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
