"use client";
import React from "react";
import TextField from "./input/TextField";
import { useReactHookForm } from "@/hooks/useReactHookForm";
import {
  type ChangeDefaultPasswordFields,
  changeDefaultPasswordSchema,
} from "@/rules/validations/auth";
import PasswordAdornment from "./adornments/PasswordAdornment";
import { Button } from "@nextui-org/react";
import { useRouter } from "next13-progressbar";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/helpers";
import { useServerAction } from "@/hooks/useServerAction";
import { changeDefaultPassword } from "@/actions/auth";

export function ChangeDefaultPassword() {
  const form = useReactHookForm<ChangeDefaultPasswordFields>(
    changeDefaultPasswordSchema
  );
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);

  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  const [
    changeDefaultPasswordAction,
    { loading: changeDefaultPasswordLoading },
  ] = useServerAction<any, typeof changeDefaultPassword>(changeDefaultPassword);

  const onSubmit = async (data: ChangeDefaultPasswordFields) => {
    try {
      const body = {
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
      };
      const response = await changeDefaultPasswordAction(body);
      if (response?.error) {
        toast.error(response.error);
        return;
      }
      toast.success(
        "Password changed successfully, you will be redirected to login"
      );
      await handleLogout();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div>
      <div className="md:max-w-lg p-4 mx-auto flex flex-col justify-center h-screen">
        <h3 className="text-2xl font-semibold">Change Default Password</h3>
        <p className="text-gray-500">
          For your security, please update your default password to something
          unique and secure.
        </p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10">
          <div className="flex flex-col gap-y-5">
            <TextField
              control={form.control}
              name="currentPassword"
              label="Current Password"
              placeholder="Current Password"
              variant="bordered"
              labelPlacement="outside"
              endContent={
                <PasswordAdornment
                  password={showCurrentPassword}
                  showPassword={setShowCurrentPassword}
                />
              }
              radius="sm"
              size="lg"
              type={showCurrentPassword ? "text" : "password"}
            />
            <TextField
              control={form.control}
              name="newPassword"
              label="New Password"
              placeholder="New Password"
              variant="bordered"
              labelPlacement="outside"
              endContent={
                <PasswordAdornment
                  password={showPassword}
                  showPassword={setShowPassword}
                />
              }
              radius="sm"
              size="lg"
              type={showPassword ? "text" : "password"}
            />
            <TextField
              control={form.control}
              name="confirmPassword"
              label="Confirm new Password"
              placeholder="Confirm Password"
              variant="bordered"
              labelPlacement="outside"
              endContent={
                <PasswordAdornment
                  password={showConfirmPassword}
                  showPassword={setShowConfirmPassword}
                />
              }
              radius="sm"
              size="lg"
              type={showConfirmPassword ? "text" : "password"}
            />
            <div className="flex items-center justify-center gap-x-2 mt-3">
              <Button
                type="button"
                color="danger"
                className="flex-1"
                disableRipple
                onPress={handleLogout}
                disabled={changeDefaultPasswordLoading}
                isDisabled={changeDefaultPasswordLoading}
              >
                Logout
              </Button>
              <Button
                type="submit"
                color="primary"
                className="flex-1"
                disableRipple
                isLoading={changeDefaultPasswordLoading}
              >
                Update Password
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
