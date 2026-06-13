export function SuccessModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold">¡Tu pedido está en camino!</h2>

        <button onClick={onClose} className="mt-4 text-orange-600">
          Volver al menú
        </button>
      </div>
    </div>
  );
}
