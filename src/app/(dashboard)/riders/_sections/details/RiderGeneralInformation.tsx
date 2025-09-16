import TextField from "@/components/shared/input/TextField";
import { User } from "@/types/auth";
import { Button } from "@nextui-org/react";
import React from "react";
import { useForm } from "react-hook-form";
import {
  updateUserValidationSchema,
  type UpdateUserFields,
} from "@/rules/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useServerAction } from "@/hooks/useServerAction";
import { updateUser } from "@/actions/users";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/helpers";
import FileUpload from "@/components/shared/input/FileUpload";
import { RiderInfoSecuritySection } from "./RiderInfoSecuritySection";

export default function RiderGeneralInformation({ user }: { user: User }) {
  const form = useForm<UpdateUserFields>({
    resolver: zodResolver(updateUserValidationSchema),
    defaultValues: {
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      address: user.address || undefined,
    },
  });

  const [updateUserAction, { loading }] = useServerAction<
    any,
    typeof updateUser
  >(updateUser);

  const onSubmit = async (data: UpdateUserFields) => {
    try {
      const { profilePicture, ...rest } = data;
      const formData = new FormData();
      for (const key in rest) {
        // @ts-ignore
        formData.append(key, rest[key]);
      }
      if (profilePicture) {
        formData.append("profilePicture", profilePicture[0] as unknown as File);
      }
      const response = await updateUserAction(user.id, formData);
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
      <h2 className="text-2xl my-5 font-bold">General Information</h2>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-gray-50 p-5 md:p-8"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <TextField
            name="fullName"
            label="Full Name"
            placeholder="Full Name"
            variant="bordered"
            labelPlacement="outside"
            radius="sm"
            size="lg"
            control={form.control}
          />
          <TextField
            name="email"
            label="Email"
            placeholder="Email"
            variant="bordered"
            labelPlacement="outside"
            radius="sm"
            size="lg"
            control={form.control}
            readOnly
            disabled
          />
          <TextField
            name="phone"
            label="Phone"
            placeholder="Phone"
            variant="bordered"
            labelPlacement="outside"
            radius="sm"
            size="lg"
            control={form.control}
            readOnly
            disabled
          />
          <TextField
            name="address"
            label="Address"
            placeholder="Address"
            variant="bordered"
            labelPlacement="outside"
            radius="sm"
            size="lg"
            control={form.control}
          />
          <div className="md:col-span-2">
            <FileUpload
              label="Profile Picture"
              {...form.register("profilePicture")}
              name="profilePicture"
              errorMessage={form.formState.errors?.profilePicture?.message?.toString()}
              defaultValue={user.profilePicture ?? undefined}
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
            Update Information
          </Button>
        </div>
      </form>
      <RiderInfoSecuritySection user={user} />
    </section>
  );
}
