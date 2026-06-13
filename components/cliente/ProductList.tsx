import { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

interface Props {
  products: Product[];
  onAdd: (product: Product) => void;
}

export function ProductList({ products, onAdd }: Props) {
  return (
    <div className="space-y-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAdd={onAdd} />
      ))}
    </div>
  );
}
