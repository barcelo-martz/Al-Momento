interface Props {
  subtotal: number;
}

export function CartSummary({ subtotal }: Props) {
  return (
    <div className="border-t pt-4">
      <div className="flex justify-between">
        <span>Total</span>
        <span>${subtotal}</span>
      </div>
    </div>
  );
}
