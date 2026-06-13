import { Product } from "@/lib/types";
import { useState } from "react";

interface Props {
  platos: Product[];
}

export default function EditorMenu({ platos }: Props) {
  const categories = Array.from(new Set(platos.map((p) => p.category)));
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  return (
    <div className="card">
      <table className="w-full">
        <thead>
          <tr>
            <th>Plato</th>
            <th>Precio</th>
            <th>Disponible</th>
            <th>Categoría</th>
          </tr>
        </thead>

        <tbody>
          {platos.map((plato) => (
            <tr key={plato.id}>
              <td>{plato.name}</td>
              <td>${plato.price}</td>
              <td>{plato.available ? "Sí" : "No"}</td>
              <td>{plato.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
