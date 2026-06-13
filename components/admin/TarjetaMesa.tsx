import { Mesa } from "@/lib/types";

interface Props {
  mesa: Mesa;
}

export default function TarjetaMesa({ mesa }: Props) {
  const libre = mesa.estado === "libre";

  return (
    <div
      className={`
        rounded-2xl p-4 border
        ${
          libre
            ? "border-gray-200"
            : mesa.estado === "pendiente"
              ? "border-orange-400"
              : "border-green-500"
        }
      `}
    >
      <h3 className="text-4xl font-bold">{mesa.numero}</h3>

      <p className="capitalize mb-4">{mesa.estado}</p>

      {!libre && (
        <>
          <ul className="space-y-2 mb-4">
            {mesa.pedidos.map((pedido) => (
              <li key={pedido.platoId}>
                {pedido.cantidad}x {pedido.nombre}
              </li>
            ))}
          </ul>

          <div className="font-bold">${mesa.total}</div>
        </>
      )}

      {libre && <button className="btn-secondary">Abrir Mesa</button>}
    </div>
  );
}
