import { CartProvider } from "@/context/CartContext";

export default function MesaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CartProvider>{children}</CartProvider>;
}
