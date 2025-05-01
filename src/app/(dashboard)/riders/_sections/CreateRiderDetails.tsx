import PasswordAdornment from "@/components/shared/adornments/PasswordAdornment";
import { DatePicker } from "@/components/shared/input/DatePicker";
import FileUpload from "@/components/shared/input/FileUpload";
import SelectInput from "@/components/shared/input/SelectInput";
import TextField from "@/components/shared/input/TextField";
import {
  BikeTypes,
  IdentificationDocumentTypeOptions,
} from "@/config/constants/data";
import { generateRandomPassword } from "@/utils/helpers";
import { useState } from "react";

interface Props {
  control: any;
  setValue: any;
  register: any;
  errors: any;
}
export default function CreateRiderDetails(props: Props) {
  const { control, setValue, register, errors } = props;
  const [showPassword, setShowPassword] = useState(false);

  const getRandomPassword = () => {
    const password = generateRandomPassword(8);
    setValue("password", password, { shouldTouch: true, shouldDirty: true });
    setShowPassword(false);
  };

  return (
    <div>
      <div className="bg-white p-5">
        <h5 className="font-semibold text-md mb-5">Rider Personal Details</h5>
        <div className="grid sm:grid-cols-2 gap-4">
          <TextField
            name="fullName"
            control={control}
            label="Full Name"
            placeholder="Full Name"
            variant="bordered"
            labelPlacement="outside"
            radius="sm"
          />
          <TextField
            name="phone"
            control={control}
            label="Phone"
            placeholder="Phone"
            variant="bordered"
            labelPlacement="outside"
            radius="sm"
          />
          <TextField
            name="email"
            control={control}
            label="Email"
            placeholder="Email"
            variant="bordered"
            labelPlacement="outside"
            radius="sm"
          />
          <div>
            <TextField
              name="password"
              control={control}
              label="Password"
              placeholder="Password"
              variant="bordered"
              labelPlacement="outside"
              radius="sm"
              endContent={
                <PasswordAdornment
                  password={showPassword}
                  showPassword={setShowPassword}
                />
              }
              type={showPassword ? "password" : "text"}
            />
            <button
              onClick={getRandomPassword}
              className="p-0 text-success font-normal mb-2 mt-px text-sm"
              type="button"
            >
              Generate random password
            </button>
          </div>
          <FileUpload
            label="Profile Picture"
            {...register("profilePicture")}
            name="profilePicture"
            errorMessage={errors?.profilePicture?.message?.toString()}
          />
        </div>
      </div>
      <div className="bg-white p-5 my-6">
        <h5 className="font-semibold text-md mb-5">Bike information</h5>
        <div className="grid sm:grid-cols-2 gap-4">
          <TextField
            name="bikeRegistrationNumber"
            control={control}
            label="Bike Registration Number"
            placeholder="Bike Registration Number"
            variant="bordered"
            labelPlacement="outside"
            radius="sm"
          />
          {/* <TextField
            name="bikeType"
            control={control}
            label="Bike Type"
            placeholder="Bike Type"
            variant="bordered"
            labelPlacement="outside"
            radius="sm"
          /> */}
          <SelectInput
            options={BikeTypes}
            control={control}
            name="bikeType"
            label="Bike Type"
            placeholder="Bike Type"
          />
          <TextField
            name="bikeColor"
            control={control}
            label="Bike Color"
            placeholder="Bike Color"
            variant="bordered"
            labelPlacement="outside"
            radius="sm"
          />

          <TextField
            name="bikeBrand"
            control={control}
            label="Bike Brand"
            placeholder="Bike Brand"
            variant="bordered"
            labelPlacement="outside"
            radius="sm"
          />
          <TextField
            name="bikeModel"
            control={control}
            label="Bike Model"
            placeholder="Bike Model"
            variant="bordered"
            labelPlacement="outside"
            radius="sm"
          />
          <TextField
            name="bikeYear"
            control={control}
            label="Bike Year"
            placeholder="Bike Year"
            variant="bordered"
            labelPlacement="outside"
            radius="sm"
            type="number"
            min={2000}
            max={new Date().getFullYear()}
          />
          {/* <TextField
            name="identificationDocumentType"
            control={control}
            label="Identification Document Type"
            placeholder="Identification Document Type"
            variant="bordered"
            labelPlacement="outside"
            radius="sm"
          /> */}

          <SelectInput
            options={IdentificationDocumentTypeOptions}
            control={control}
            name="identificationDocumentType"
            label="Identification Document Type"
            placeholder="Identification Document Type"
          />
          <TextField
            name="identificationDocumentNumber"
            control={control}
            label="Identification Document Number"
            placeholder="Identification Document Number"
            variant="bordered"
            labelPlacement="outside"
            radius="sm"
          />

          <div className="sm:col-span-2">
            {/* <TextField
              name="documentExpiryDate"
              control={control}
              label="Document Expiry Date"
              placeholder="Document Expiry Date"
              variant="bordered"
              labelPlacement="outside"
              radius="sm"
              type="date"
            /> */}
            <DatePicker
              name="documentExpiryDate"
              control={control}
              label="Document Expiry Date"
              minDate={new Date()}
            />
          </div>

          <FileUpload
            label="BikeImage"
            {...register("bikeImage")}
            name="bikeImage"
            errorMessage={errors?.bikeImage?.message?.toString()}
          />
          <FileUpload
            label="Identification Document Image"
            {...register("identificationDocumentImage")}
            name="identificationDocumentImage"
            errorMessage={errors?.identificationDocumentImage?.message?.toString()}
          />
        </div>
      </div>
    </div>
  );
}
