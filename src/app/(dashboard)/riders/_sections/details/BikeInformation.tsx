import React from "react";
import TextField from "@/components/shared/input/TextField";
import { Button } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { Rider } from "@/types/auth";
import FileUpload from "@/components/shared/input/FileUpload";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  bikeDetailsValidations,
  type BikeDetailsDto,
} from "@/rules/validations/rider";
import { useServerAction } from "@/hooks/useServerAction";
import { updateRider } from "@/actions/riders";
import { getErrorMessage } from "@/utils/helpers";
import { toast } from "sonner";
import { DatePicker } from "@/components/shared/input/DatePicker";

export default function BikeInformation({ rider }: { rider: Rider }) {
  const { rider: riderData } = rider;

  const form = useForm<Partial<BikeDetailsDto>>({
    resolver: zodResolver(bikeDetailsValidations.partial()),
    defaultValues: {
      bikeRegistrationNumber: riderData.bikeRegistrationNumber,
      bikeType: riderData.bikeType,
      bikeColor: riderData.bikeColor,
      bikeBrand: riderData.bikeBrand,
      bikeModel: riderData.bikeModel,
      bikeYear: riderData.bikeYear,
      identificationDocumentType: riderData.identificationDocumentType,
      identificationDocumentNumber: riderData.identificationDocumentNumber,
      documentExpiryDate: new Date(riderData.documentExpiryDate),
    },
  });

  const [updateRiderInfo, { loading }] = useServerAction<
    any,
    typeof updateRider
  >(updateRider);

  const onSubmit = async (data: Partial<BikeDetailsDto>) => {
    try {
      const { identificationDocumentImage, bikeImage, ...rest } = data;

      const formData = new FormData();

      for (const key in rest) {
        // @ts-ignore
        formData.append(key, rest[key]);
      }

      if (identificationDocumentImage) {
        formData.append(
          "identificationDocumentImage",
          identificationDocumentImage[0] as unknown as File
        );
      }
      if (bikeImage) {
        formData.append("bikeImage", bikeImage[0] as unknown as File);
      }

      const response = await updateRiderInfo(riderData.id, formData);
      if (response?.error) {
        toast.error(response.error);
        return;
      }
      toast.success("Rider information updated");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <section className="max-w-4xl mx-auto p-5">
      <h2 className="text-2xl my-5 font-bold">Bike Information</h2>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="bg-gray-50 p-5 md:p-8 grid md:grid-cols-2 gap-4">
          <TextField
            name="bikeRegistrationNumber"
            control={form.control}
            label="Bike Registration Number"
            placeholder="Bike Registration Number"
            variant="bordered"
            labelPlacement="outside"
            radius="sm"
            size="md"
          />
          <TextField
            name="bikeType"
            control={form.control}
            label="Bike Type"
            placeholder="Bike Type"
            variant="bordered"
            labelPlacement="outside"
            radius="sm"
            size="md"
          />
          <TextField
            name="bikeColor"
            control={form.control}
            label="Bike Color"
            placeholder="Bike Color"
            variant="bordered"
            labelPlacement="outside"
            radius="sm"
            size="md"
          />

          <TextField
            name="bikeBrand"
            control={form.control}
            label="Bike Brand"
            placeholder="Bike Brand"
            variant="bordered"
            labelPlacement="outside"
            radius="sm"
            size="md"
          />
          <TextField
            name="bikeModel"
            control={form.control}
            label="Bike Model"
            placeholder="Bike Model"
            variant="bordered"
            labelPlacement="outside"
            radius="sm"
            size="md"
          />
          <TextField
            name="bikeYear"
            control={form.control}
            label="Bike Year"
            placeholder="Bike Year"
            variant="bordered"
            labelPlacement="outside"
            radius="sm"
            size="md"
            type="number"
            min={2000}
            max={new Date().getFullYear()}
          />
          <TextField
            name="identificationDocumentType"
            control={form.control}
            label="Identification Document Type"
            placeholder="Identification Document Type"
            variant="bordered"
            labelPlacement="outside"
            radius="sm"
            size="md"
          />

          <TextField
            name="identificationDocumentNumber"
            control={form.control}
            label="Identification Document Number"
            placeholder="Identification Document Number"
            variant="bordered"
            labelPlacement="outside"
            radius="sm"
            size="md"
          />

          <DatePicker
            name="documentExpiryDate"
            control={form.control}
            label="Document Expiry Date"
            minDate={new Date()}
          />
        </div>
        <h2 className="text-2xl my-5 font-bold border-b pb-2">Bike Document</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <FileUpload
            label="Bike Image"
            {...form.register("bikeImage")}
            name="bikeImage"
            errorMessage={form.formState.errors?.bikeImage?.message?.toString()}
            defaultValue={riderData.bikeImage}
          />
          <FileUpload
            label="Identification Document Image"
            {...form.register("identificationDocumentImage")}
            name="identificationDocumentImage"
            errorMessage={form.formState.errors?.identificationDocumentImage?.message?.toString()}
            defaultValue={riderData.identificationDocumentImage}
          />
        </div>
        <Button
          type="submit"
          variant="solid"
          size="md"
          color="primary"
          radius="sm"
          disableRipple
          className="mt-5"
          isLoading={loading}
        >
          Update Rider Information
        </Button>
      </form>
    </section>
  );
}
