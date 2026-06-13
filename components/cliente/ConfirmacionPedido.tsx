interface Props {
  mesa: number;
}

export default function ConfirmacionPedido({ mesa }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="text-6xl mb-4">✅</div>

      <h1 className="text-3xl font-bold">Pedido enviado</h1>

      <p className="text-gray-500 mt-2">Mesa {mesa}</p>
    </div>
  );
}
