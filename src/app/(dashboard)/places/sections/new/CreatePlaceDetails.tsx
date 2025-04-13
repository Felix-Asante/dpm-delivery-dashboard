import TextField from "@/components/shared/input/TextField";
import { Category } from "@/types/category";
import { Select, SelectItem } from "@nextui-org/react";
import React from "react";
import { Controller } from "react-hook-form";

interface Props {
  control: any;
  categories: Category[];
  categoryErrorMessage?: string;
}
export default function CreatePlaceDetails({
  control,
  categories,
  categoryErrorMessage,
}: Props) {
  return (
    <>
      <TextField
        name="name"
        control={control}
        label="Name"
        placeholder="Name"
        variant="bordered"
        labelPlacement="outside"
        radius="sm"
      />
      <Controller
        render={({ field }) => (
          <Select
            label="Select category"
            placeholder="Select category"
            labelPlacement="outside"
            radius="sm"
            variant="bordered"
            value={field.value}
            onChange={field.onChange}
            errorMessage={categoryErrorMessage}
          >
            {categories?.map((category) => (
              <SelectItem
                key={category?.id}
                value={category?.id}
                className="capitalize"
              >
                {category?.name}
              </SelectItem>
            ))}
          </Select>
        )}
        name="category"
        control={control}
        defaultValue={categories[0]?.id}
      />
      <TextField
        name="phone"
        control={control}
        label="Phone"
        placeholder="Phone"
        variant="bordered"
        labelPlacement="outside"
        radius="sm"
        type="tel"
      />
      <TextField
        name="email"
        control={control}
        label="Email"
        placeholder="Email"
        variant="bordered"
        labelPlacement="outside"
        radius="sm"
        type="email"
      />
      <TextField
        name="address"
        control={control}
        label="Address"
        placeholder="Address"
        variant="bordered"
        labelPlacement="outside"
        radius="sm"
      />
      <TextField
        name="longitude"
        control={control}
        label="Longitude"
        placeholder="Longitude"
        variant="bordered"
        labelPlacement="outside"
        radius="sm"
      />
      <TextField
        name="latitude"
        control={control}
        label="Latitude"
        placeholder="Latitude"
        variant="bordered"
        labelPlacement="outside"
        radius="sm"
      />
      <TextField
        name="website"
        control={control}
        label="Website"
        placeholder="Website"
        variant="bordered"
        labelPlacement="outside"
        radius="sm"
        type="url"
      />
      <TextField
        name="averagePrice"
        control={control}
        label="Average Price"
        placeholder="Average Price"
        variant="bordered"
        labelPlacement="outside"
        radius="sm"
        type="number"
        min={0}
      />
      <TextField
        name="deliveryFee"
        control={control}
        label="Delivery Fee"
        placeholder="Delivery Fee"
        variant="bordered"
        labelPlacement="outside"
        radius="sm"
        type="number"
        min={0}
      />
      <TextField
        name="min_prep_time"
        control={control}
        label="Min Preparation Time"
        placeholder="Min Preparation Time"
        variant="bordered"
        labelPlacement="outside"
        radius="sm"
        type="number"
        min={0}
      />
      <TextField
        name="max_prep_time"
        control={control}
        label="Max Preparation Time"
        placeholder="Max Preparation Time"
        variant="bordered"
        labelPlacement="outside"
        radius="sm"
        type="number"
        min={0}
      />
    </>
  );
}
