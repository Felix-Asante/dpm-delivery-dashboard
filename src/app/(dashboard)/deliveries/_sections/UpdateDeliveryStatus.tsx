import SelectInput from "@/components/shared/input/SelectInput";
import TextField from "@/components/shared/input/TextField";
import { ShipmentStatus, UserRoles } from "@/config/constants";
import {
  type UpdateShipmentHistoryField,
  updateShipmentHistorySchema,
} from "@/rules/validations/shipment";
import React from "react";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateShipmentHistory } from "@/actions/shipment";
import { getErrorMessage, getShipmentStatusDisplay } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import type { Shipment } from "@/types/shipment";
import { useServerAction } from "@/hooks/useServerAction";
import FileUpload from "@/components/shared/input/FileUpload";
import { Button, Checkbox } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  shipment: Shipment;
  onSuccess: () => void;
}

const OrderStatus = [
  {
    label: "Pending",
    value: ShipmentStatus.PENDING,
    key: ShipmentStatus.PENDING,
    show: (role: UserRoles) => role === UserRoles.ADMIN,
  },
  {
    label: "Out for Delivery",
    value: ShipmentStatus.OUT_FOR_DELIVERY,
    key: ShipmentStatus.OUT_FOR_DELIVERY,
    show: (role: UserRoles) =>
      [UserRoles.ADMIN, UserRoles.COURIER].includes(role),
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
    label: "Returned",
    value: ShipmentStatus.RETURNED,
    key: ShipmentStatus.RETURNED,
    show: (role: UserRoles) => role === UserRoles.ADMIN,
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

export default function UpdateDeliveryStatus({ shipment, onSuccess }: Props) {
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
      formData.append("isPaid", data.paid === true ? "true" : "false");

      const response = await updateHistory(shipment.id, formData);
      if (response?.error) {
        toast.error(response.error);
        return;
      }
      toast.success("Shipment history updated");
      router.refresh();
      onSuccess();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const { data } = useSession();
  const role = data?.user?.role.name as UserRoles;

  const filteredStatus = OrderStatus.filter((order) => order.show(role));

  const currentStatusLabel = getShipmentStatusDisplay(
    shipment?.status,
    role === UserRoles.ADMIN
  );

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      [ShipmentStatus.DELIVERED]: "bg-green-50 text-green-700 border-green-200",
      [ShipmentStatus.OUT_FOR_DELIVERY]:
        "bg-blue-50 text-blue-700 border-blue-200",
      [ShipmentStatus.IN_TRANSIT]: "bg-blue-50 text-blue-700 border-blue-200",
      [ShipmentStatus.PENDING]:
        "bg-yellow-50 text-yellow-700 border-yellow-200",
      [ShipmentStatus.FAILED_DELIVERY_ATTEMPT]:
        "bg-red-50 text-red-700 border-red-200",
      [ShipmentStatus.RETURNED]:
        "bg-orange-50 text-orange-700 border-orange-200",
      [ShipmentStatus.ON_HOLD]:
        "bg-orange-50 text-orange-700 border-orange-200",
      [ShipmentStatus.PAYMENT_RECEIVED]:
        "bg-green-50 text-green-700 border-green-200",
      [ShipmentStatus.REFUNDED]: "bg-gray-50 text-gray-700 border-gray-200",
      [ShipmentStatus.PICKUP_CONFIRMED]:
        "bg-teal-50 text-teal-700 border-teal-200",
      [ShipmentStatus.READY_FOR_PICKUP]:
        "bg-purple-50 text-purple-700 border-purple-200",
      [ShipmentStatus.REPACKAGED]:
        "bg-indigo-50 text-indigo-700 border-indigo-200",
      [ShipmentStatus.ARRIVED]: "bg-cyan-50 text-cyan-700 border-cyan-200",
    };
    return colorMap[status] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  return (
    <form
      onSubmit={handleSubmit(updateHistoryHandler)}
      className="mt-4 flex flex-col gap-4"
    >
      <div className="rounded-lg border-2 bg-gradient-to-br from-gray-50 to-gray-100/50 p-4">
        <div className="mb-2 text-sm font-medium text-gray-600">
          Current Status
        </div>
        <div
          className={`inline-flex items-center rounded-md border-2 px-4 py-2 text-sm font-semibold shadow-sm ${getStatusColor(
            shipment?.status
          )}`}
        >
          {currentStatusLabel}
        </div>
      </div>

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
        <>
          <TextField
            name="confirmationCode"
            control={control}
            label="Confirmation Code"
            placeholder="Confirmation Code"
            variant="bordered"
            labelPlacement="outside"
            radius="sm"
          />

          <Controller
            name="paid"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="paid"
                isSelected={field.value}
                onValueChange={(state) => {
                  field.onChange(state);
                }}
                onBlur={field.onBlur}
              >
                Has the order been paid?
              </Checkbox>
            )}
          />
        </>
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
