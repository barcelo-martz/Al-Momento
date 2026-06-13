interface Props {
  ventas: number;
  mesasOcupadas: number;
}

export default function ResumenDia({ ventas, mesasOcupadas }: Props) {
  return (
    <div className="card">
      <h2 className="text-xl font-bold">Resumen del Día</h2>

      <div className="mt-4 flex gap-6">
        <div>
          <p className="text-sm text-gray-500">Ventas</p>

          <p className="text-2xl font-bold">${ventas}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Mesas ocupadas</p>

          <p className="text-2xl font-bold">{mesasOcupadas}</p>
        </div>
      </div>
    </div>
  );
}
