import { assignRider } from "@/actions/shipment";
import InfiniteScrollSelect from "@/components/shared/input/InfiniteScrollSelectInput";
import { useServerAction } from "@/hooks/useServerAction";
import { apiConfig } from "@/lib/apiConfig";
import {
  AssignRiderField,
  assignRiderSchema,
} from "@/rules/validations/shipment";
import { Rider } from "@/types/auth";
import { Shipment } from "@/types/shipment";
import { getErrorMessage } from "@/utils/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import UpdateDeliveryStatus from "./UpdateDeliveryStatus";

interface Props {
  shipment: Shipment;
}

export function EditOrder({ shipment }: Props) {
  const form = useForm<AssignRiderField>({
    resolver: zodResolver(assignRiderSchema),
    defaultValues: {
      // @ts-ignore
      riderId: shipment?.rider,
    },
  });

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
      <p className="mt-5">Update Order Status</p>
      <UpdateDeliveryStatus shipment={shipment} />
    </div>
  );
}
