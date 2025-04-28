import { assignRider, updateShipmentHistory } from "@/actions/shipment";
import FileUpload from "@/components/shared/input/FileUpload";
import InfiniteScrollSelect from "@/components/shared/input/InfiniteScrollSelectInput";
import SelectInput from "@/components/shared/input/SelectInput";
import TextField from "@/components/shared/input/TextField";
import { ShipmentStatus } from "@/config/constants";
import { useServerAction } from "@/hooks/useServerAction";
import { apiConfig } from "@/lib/apiConfig";
import {
  AssignRiderField,
  assignRiderSchema,
  UpdateShipmentHistoryField,
  updateShipmentHistorySchema,
} from "@/rules/validations/shipment";
import { Rider } from "@/types/auth";
import { Shipment } from "@/types/shipment";
import { getErrorMessage } from "@/utils/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface Props {
  shipment: Shipment;
}

const OrderStatus = [
  {
    label: "Pending",
    value: ShipmentStatus.PENDING,
    key: ShipmentStatus.PENDING,
  },
  {
    label: "Delivered",
    value: ShipmentStatus.DELIVERED,
    key: ShipmentStatus.DELIVERED,
  },
  {
    label: "Failed Delivery Attempt",
    value: ShipmentStatus.FAILED_DELIVERY_ATTEMPT,
    key: ShipmentStatus.FAILED_DELIVERY_ATTEMPT,
  },
  {
    label: "Pickup Confirmed",
    value: ShipmentStatus.PICKUP_CONFIRMED,
    key: ShipmentStatus.PICKUP_CONFIRMED,
  },
  {
    label: "Out for Delivery",
    value: ShipmentStatus.OUT_FOR_DELIVERY,
    key: ShipmentStatus.OUT_FOR_DELIVERY,
  },
];

export function EditOrder({ shipment }: Props) {
  const { control, handleSubmit } = useForm<UpdateShipmentHistoryField>({
    resolver: zodResolver(updateShipmentHistorySchema),
    defaultValues: {
      status: shipment?.status,
    },
  });

  const form = useForm<AssignRiderField>({
    resolver: zodResolver(assignRiderSchema),
    defaultValues: {
      // @ts-ignore
      riderId: shipment?.rider,
    },
  });

  const [updateHistory, { loading }] = useServerAction(updateShipmentHistory);
  const [addRider, { loading: assigningRider }] = useServerAction(assignRider);

  const assignRiderHandler = async (data: AssignRiderField) => {
    try {
      const response = await addRider(shipment.id, data.riderId);
      if (response?.error) {
        toast.error(response?.error);
        return;
      }
      toast.success("Rider assigned to order");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const updateHistoryHandler = async (data: UpdateShipmentHistoryField) => {
    try {
      const formData = new FormData();
      formData.append("status", data.status);
      formData.append("description", data.reason || "");
      formData.append("photo", data.photo || "");

      const response = await updateHistory(shipment.id, formData);
      if (response?.error) {
        toast.error(response.error);
        return;
      }
      toast.success("Shipment history updated");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="mt-5">
      <div>
        <p>Assigned Rider</p>
        {/* @ts-ignore */}
        <form onSubmit={form.handleSubmit(assignRiderHandler)}>
          <Controller
            name="riderId"
            render={({ field }) => (
              <InfiniteScrollSelect
                url={apiConfig.riders.list({})}
                getOptionLabel={(option: Rider) => option?.fullName}
                getOptionValue={(option: Rider) => option?.id}
                isOptionSelected={(option: Rider, selectedValue: Rider[]) => {
                  const isSelected = option?.id === selectedValue?.[0]?.id;
                  return isSelected;
                }}
                defaultValue={shipment?.rider?.fullName}
                {...field}
              />
            )}
            control={form.control}
          />

          <div className="mt-6">
            <Button
              type="submit"
              radius="sm"
              disableRipple
              color="primary"
              isLoading={assigningRider}
            >
              Assign Rider
            </Button>
          </div>
        </form>
      </div>
      <form
        onSubmit={handleSubmit(updateHistoryHandler)}
        className="mt-4 flex flex-col gap-4"
      >
        <p>Update Order Status</p>
        <SelectInput
          options={OrderStatus}
          control={control}
          name="status"
          defaultValue={shipment?.status}
        />

        <TextField
          name="reason"
          control={control}
          label="Reason"
          placeholder="Reason"
          variant="bordered"
          labelPlacement="outside"
          radius="sm"
        />

        <FileUpload name="photo" label="Attach Photo" />
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
    </div>
  );
}
