interface OrderItemProps {
  label: string;
  value: string;
}

export function OrderItem({ label, value }: OrderItemProps) {
  return (
    <div>
      <p className="font-semibold text-gray-500 text-sm">{label}</p>
      <p className="text-base">{value}</p>
    </div>
  );
}
