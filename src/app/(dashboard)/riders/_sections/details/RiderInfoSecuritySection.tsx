import React from "react";
import type { User } from "@/types/auth";
import { useReactHookForm } from "@/hooks/useReactHookForm";
import { Button } from "@nextui-org/react";
import TextField from "@/components/shared/input/TextField";
import {
  ChangePasswordFields,
  changePasswordSchema,
} from "@/rules/validations/auth";
import PasswordAdornment from "@/components/shared/adornments/PasswordAdornment";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/helpers";
import { changePassword } from "@/actions/auth";
import { useServerAction } from "@/hooks/useServerAction";

interface RiderInfoSecuritySectionProps {
  user: User;
}
export function RiderInfoSecuritySection({
  user,
}: Readonly<RiderInfoSecuritySectionProps>) {
  const form = useReactHookForm<ChangePasswordFields>(changePasswordSchema);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [confirmChangePassword, setConfirmChangePassword] =
    React.useState(false);

  const [changePasswordAction, { loading: changePasswordLoading }] =
    useServerAction<any, typeof changePassword>(changePassword);

  const onSubmit = async (data: ChangePasswordFields) => {
    try {
      const response = await changePasswordAction({
        newPassword: data.password,
        userId: user.id,
      });
      if (response?.error) {
        toast.error(response.error);
        return;
      }
      form.setValue("password", "");
      form.setValue("confirmPassword", "");
      toast.success("Password changed successfully");
      setConfirmChangePassword(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <section className="mt-8">
      <h4 className="text-2xl my-5 font-bold pb-2 border-b">
        Account Security
      </h4>
      <div className="p-5 rounded-lg border">
        <h6 className="text-lg font-semibold">Change Password</h6>
        <p className="text-sm text-gray-500">Modify rider password</p>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4 mt-5">
            <TextField
              name="password"
              label="Password"
              placeholder="Password"
              variant="bordered"
              labelPlacement="outside"
              radius="sm"
              size="lg"
              type={showPassword ? "text" : "password"}
              control={form.control}
              endContent={
                <PasswordAdornment
                  password={showPassword}
                  showPassword={setShowPassword}
                />
              }
            />
            <TextField
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm Password"
              variant="bordered"
              labelPlacement="outside"
              radius="sm"
              size="lg"
              type={showConfirmPassword ? "text" : "password"}
              control={form.control}
              endContent={
                <PasswordAdornment
                  password={showConfirmPassword}
                  showPassword={setShowConfirmPassword}
                />
              }
            />
          </div>
          <div className="flex items-center gap-3 mt-5">
            {!confirmChangePassword ? (
              <Button
                type="button"
                size="sm"
                color="primary"
                radius="sm"
                disableRipple
                onPress={() => setConfirmChangePassword(true)}
              >
                Update Password
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  size="sm"
                  variant="bordered"
                  radius="sm"
                  disableRipple
                  onPress={() => setConfirmChangePassword(false)}
                  isDisabled={changePasswordLoading}
                  disabled={changePasswordLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  color="primary"
                  radius="sm"
                  disableRipple
                  isLoading={changePasswordLoading}
                >
                  Change Password
                </Button>
              </>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
