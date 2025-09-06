import SelectInput from "@/components/shared/input/SelectInput";
import TextField from "@/components/shared/input/TextField";
import { ShipmentStatus, UserRoles } from "@/config/constants";
import {
  type UpdateShipmentHistoryField,
  updateShipmentHistorySchema,
} from "@/rules/validations/shipment";
import React from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateShipmentHistory } from "@/actions/shipment";
import { getErrorMessage } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import type { Shipment } from "@/types/shipment";
import { useServerAction } from "@/hooks/useServerAction";
import FileUpload from "@/components/shared/input/FileUpload";
import { Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";

interface Props {
  shipment: Shipment;
}

const OrderStatus = [
  {
    label: "Pending",
    value: ShipmentStatus.PENDING,
    key: ShipmentStatus.PENDING,
    show: (role: UserRoles) => role === UserRoles.ADMIN,
  },
  {
    label: "Delivered",
    value: ShipmentStatus.DELIVERED,
    key: ShipmentStatus.DELIVERED,
    show: (role: UserRoles) =>
      [UserRoles.ADMIN, UserRoles.COURIER].includes(role),
  },
  {
    label: "Failed Delivery Attempt",
    value: ShipmentStatus.FAILED_DELIVERY_ATTEMPT,
    key: ShipmentStatus.FAILED_DELIVERY_ATTEMPT,
    show: (role: UserRoles) =>
      [UserRoles.ADMIN, UserRoles.COURIER].includes(role),
  },
  {
    label: "Pickup Confirmed",
    value: ShipmentStatus.PICKUP_CONFIRMED,
    key: ShipmentStatus.PICKUP_CONFIRMED,
    show: (role: UserRoles) =>
      [UserRoles.ADMIN, UserRoles.COURIER].includes(role),
  },
  {
    label: "Payment Received",
    value: ShipmentStatus.PAYMENT_RECEIVED,
    key: ShipmentStatus.PAYMENT_RECEIVED,
    show: (role: UserRoles) => [UserRoles.ADMIN].includes(role),
  },
  {
    label: "Refunded",
    value: ShipmentStatus.REFUNDED,
    key: ShipmentStatus.REFUNDED,
    show: (role: UserRoles) => [UserRoles.ADMIN].includes(role),
  },
  {
    label: "Repackaged",
    value: ShipmentStatus.REPACKAGED,
    key: ShipmentStatus.REPACKAGED,
    show: (role: UserRoles) =>
      [UserRoles.ADMIN, UserRoles.COURIER].includes(role),
  },
  {
    label: "Ready for Pickup",
    value: ShipmentStatus.READY_FOR_PICKUP,
    key: ShipmentStatus.READY_FOR_PICKUP,
    show: (role: UserRoles) =>
      [UserRoles.ADMIN, UserRoles.COURIER].includes(role),
  },
  {
    label: "In Transit",
    value: ShipmentStatus.IN_TRANSIT,
    key: ShipmentStatus.IN_TRANSIT,
    show: (role: UserRoles) =>
      [UserRoles.ADMIN, UserRoles.COURIER].includes(role),
  },
  {
    label: "On Hold",
    value: ShipmentStatus.ON_HOLD,
    key: ShipmentStatus.ON_HOLD,
    show: (role: UserRoles) =>
      [UserRoles.ADMIN, UserRoles.COURIER].includes(role),
  },
  {
    label: "Arrived",
    value: ShipmentStatus.ARRIVED,
    key: ShipmentStatus.ARRIVED,
    show: (role: UserRoles) =>
      [UserRoles.ADMIN, UserRoles.COURIER].includes(role),
  },
];

const canAddReasons = [
  ShipmentStatus.FAILED_DELIVERY_ATTEMPT,
  ShipmentStatus.REFUNDED,
  ShipmentStatus.REPACKAGED,
  ShipmentStatus.ON_HOLD,
];

export default function UpdateDeliveryStatus({ shipment }: Props) {
  const router = useRouter();
  const { control, handleSubmit, watch, register } =
    useForm<UpdateShipmentHistoryField>({
      resolver: zodResolver(updateShipmentHistorySchema),
      defaultValues: {
        status: shipment?.status,
      },
    });
  const [updateHistory, { loading }] = useServerAction(updateShipmentHistory);

  const status = watch("status");

  const updateHistoryHandler = async (data: UpdateShipmentHistoryField) => {
    try {
      const formData = new FormData();
      formData.append("status", data.status);
      formData.append("description", data.reason || "");
      formData.append("photo", data.photo ? data.photo?.[0] : "");
      formData.append("confirmationCode", data.confirmationCode || "");

      const response = await updateHistory(shipment.id, formData);
      if (response?.error) {
        toast.error(response.error);
        return;
      }
      toast.success("Shipment history updated");
      router.refresh();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const { data } = useSession();
  const role = data?.user?.role.name as UserRoles;

  const filteredStatus = OrderStatus.filter((order) => order.show(role));

  return (
    <form
      onSubmit={handleSubmit(updateHistoryHandler)}
      className="mt-4 flex flex-col gap-4"
    >
      <SelectInput
        options={filteredStatus}
        control={control}
        name="status"
        label="Status"
        defaultValue={shipment?.status}
        placeholder="Select status"
      />

      {canAddReasons.includes(status as ShipmentStatus) && (
        <TextField
          name="reason"
          control={control}
          label="Reason"
          placeholder="Reason"
          variant="bordered"
          labelPlacement="outside"
          radius="sm"
        />
      )}
      {status === ShipmentStatus.DELIVERED && (
        <TextField
          name="confirmationCode"
          control={control}
          label="Confirmation Code"
          placeholder="Confirmation Code"
          variant="bordered"
          labelPlacement="outside"
          radius="sm"
        />
      )}
      {status === ShipmentStatus.PICKUP_CONFIRMED && (
        <FileUpload label="Attach Photo" {...register("photo")} />
      )}
      <Button
        isLoading={loading}
        type="submit"
        radius="sm"
        disableRipple
        color="primary"
      >
        Update Order Status
      </Button>
    </form>
  );
}
