import { useCart } from "@/context/CartContext";
import { Product } from "@/lib/types";
import Image from "next/image";

interface Props {
  product: Product;
  onAdd: (product: Product) => void;
}

export function ProductCard({ product }: Props) {
  const { addItem } = useCart();
  return (
    <div className="bg-white rounded-xl shadow flex h-32 overflow-hidden">
      <div className="relative w-1/3">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1 p-3 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold">{product.name}</h3>

          <p className="text-sm text-gray-500">{product.description}</p>
        </div>

        <div className="flex justify-between items-center">
          <span className="font-bold text-orange-600">${product.price}</span>

          <button
            onClick={() => addItem(product)}
            className="bg-orange-600 text-white w-10 h-10 rounded-lg"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
