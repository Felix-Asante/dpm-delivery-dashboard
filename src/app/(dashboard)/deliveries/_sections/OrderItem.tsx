interface OrderItemProps {
  label: string;
  value: string;
}

export function OrderItem({ label, value }: Readonly<OrderItemProps>) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-sm font-semibold capitalize text-secondary">
        {value}
      </p>
    </div>
  );
}
