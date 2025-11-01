import type { Shipment } from "@/types/shipment";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import TextField from "@/components/shared/input/TextField";
import HStack from "@/components/shared/layout/HStack";
import { Checkbox, Button } from "@nextui-org/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AddDeliveryCostSchema,
  type AddDeliveryCostInput,
} from "@/rules/validations/deliveries";
import { DatePicker } from "@/components/shared/input/DatePicker";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/helpers";
import { useServerAction } from "@/hooks/useServerAction";
import { setShipmentCost } from "@/actions/shipment";
import { ShipmentStatus } from "@/config/constants";

interface Props {
  shipment: Shipment;
  onSuccess?: () => void;
}
export default function AddDeliveryCostForm({ shipment, onSuccess }: Props) {
  const form = useForm<AddDeliveryCostInput>({
    resolver: zodResolver(AddDeliveryCostSchema),
    defaultValues: {
      paid: shipment?.shipmentCost?.paid || false,
      paidAt: shipment?.shipmentCost?.paidAt
        ? new Date(shipment?.shipmentCost?.paidAt)
        : undefined,
      includeRepackagingFee: !!shipment?.shipmentCost?.repackagingFee,
      pickupCost: shipment?.shipmentCost?.pickupFee,
      deliveryCost: shipment?.shipmentCost?.deliveryFee,
      riderCommission: shipment?.shipmentCost?.riderCommission,
      repackagingFee: shipment?.shipmentCost?.repackagingFee,
    },
  });

  const [addCost, { loading: addingCost }] = useServerAction(setShipmentCost);

  const includeRepackagingFee = form.watch("includeRepackagingFee");
  const paid = form.watch("paid");

  const isReadOnly =
    shipment?.status === ShipmentStatus.DELIVERED ||
    shipment?.shipmentCost?.paid ||
    shipment?.status === ShipmentStatus.OUT_FOR_DELIVERY;

  const onSubmit = async (data: AddDeliveryCostInput) => {
    try {
      const body = {
        pickupFee: data.pickupCost,
        deliveryFee: data.deliveryCost,
        riderCommission: data.riderCommission,
        repackagingFee: data.repackagingFee,
        paid: data.paid,
        paidAt: data.paidAt ? data.paidAt.toISOString() : undefined,
      };

      const response = await addCost(shipment.id, body);
      if (response?.error) {
        console.log(response?.error);
        toast.error(response?.error);
        return;
      }
      toast.success("Cost added successfully");
      onSuccess?.();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (!shipment) {
    return <div>Shipment not found</div>;
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid grid-cols-2 gap-4">
        <TextField
          name="pickupCost"
          control={form.control}
          label="Pickup Cost"
          type="number"
          radius="sm"
          min={0}
          placeholder="Cost of collecting the package from the sender"
          variant="bordered"
          labelPlacement="outside"
          disabled={isReadOnly}
        />
        <TextField
          name="deliveryCost"
          control={form.control}
          label="Delivery Cost"
          type="number"
          radius="sm"
          placeholder="Cost of delivering the package to its destination"
          min={0}
          variant="bordered"
          labelPlacement="outside"
          disabled={isReadOnly}
        />
        <TextField
          name="riderCommission"
          control={form.control}
          label="Rider Commission"
          type="number"
          radius="sm"
          placeholder="Commission paid to the rider"
          max={100}
          min={0}
          variant="bordered"
          labelPlacement="outside"
          disabled={isReadOnly}
        />
        <HStack>
          <Controller
            name="includeRepackagingFee"
            control={form.control}
            render={({ field }) => (
              <Checkbox
                id="includeRepackagingFee"
                isSelected={field.value}
                onValueChange={(state) => {
                  if (isReadOnly) return;
                  field.onChange(state);
                  if (!state) {
                    form.setValue("repackagingFee", undefined);
                  }
                }}
                onBlur={field.onBlur}
                disabled={isReadOnly}
                readOnly={isReadOnly}
              >
                Include repackaging fee?
              </Checkbox>
            )}
          />
          <Controller
            name="paid"
            control={form.control}
            render={({ field }) => (
              <Checkbox
                id="paid"
                isSelected={field.value}
                onValueChange={(state) => {
                  if (isReadOnly) return;
                  field.onChange(state);
                  if (!state) {
                    form.setValue("paidAt", undefined);
                  }
                }}
                onBlur={field.onBlur}
                disabled={isReadOnly}
                readOnly={isReadOnly}
              >
                Paid?
              </Checkbox>
            )}
          />
        </HStack>
        {includeRepackagingFee && (
          <TextField
            name="repackagingFee"
            control={form.control}
            label="Repackaging Fee"
            type="number"
            radius="sm"
            placeholder="Cost of repackaging the package"
            min={0}
            variant="bordered"
            labelPlacement="outside"
            disabled={isReadOnly}
          />
        )}
        {paid && (
          <DatePicker
            name="paidAt"
            control={form.control}
            label="Paid At"
            maxDate={new Date()}
            disabled={isReadOnly}
          />
        )}
      </div>
      {!isReadOnly ? (
        <Button
          isLoading={addingCost}
          color="primary"
          type="submit"
          className="mt-5"
        >
          Save cost details
        </Button>
      ) : null}
    </form>
  );
}
