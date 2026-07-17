"use client";

import PasswordAdornment from "@/components/shared/adornments/PasswordAdornment";
import TextField from "@/components/shared/input/TextField";
import { useReactHookForm } from "@/hooks/useReactHookForm";
import { LoginFormFields, loginValidations } from "@/rules/validations/auth";
import { Button } from "@heroui/button";
import { Lock, Phone } from "lucide-react";
import { getCsrfToken, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function LoginForm() {
  const { control, handleSubmit } =
    useReactHookForm<LoginFormFields>(loginValidations);
  const [isPassword, onPasswordChange] = useState(true);
  const [loading, setLoading] = useState(false);
  const session = useSession();
  const [csrfToken, setCsrfToken] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchCsrfToken() {
      const result = await getCsrfToken();
      if (!result) {
        throw new Error("Can not sign in without a CSRF token");
      }
      setCsrfToken(result);
    }

    if (session.status !== "loading") {
      fetchCsrfToken();
    }
  }, [session.status]);

  const attemptLogin = async (data: LoginFormFields) => {
    setLoading(true);
    await signIn("credentials", {
      username: data.phone,
      password: data.password,
      redirect: false,
      csrfToken: csrfToken,
    }).then((result) => {
      if (!result?.error) {
        router.replace("/");
      } else {
        toast.error("Incorrect username or password.");
        setLoading(false);
      }
    });
  };

  return (
    <div className="w-full">
      <header className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-secondary">
          Sign in
        </h1>
        <p className="text-sm leading-relaxed text-gray-500">
          Enter your phone number and password to access the dashboard.
        </p>
      </header>

      <form
        className="flex flex-col gap-5"
        onSubmit={handleSubmit(attemptLogin)}
        noValidate
      >
        <TextField
          control={control}
          name="phone"
          label="Phone number"
          labelPlacement="outside"
          placeholder="e.g. 0241234567"
          variant="bordered"
          radius="md"
          size="lg"
          autoComplete="tel"
          classNames={{
            label: "text-sm font-medium text-secondary",
            inputWrapper:
              "border-gray-200 bg-white shadow-xs data-[hover=true]:border-gray-300 group-data-[focus=true]:border-primary",
          }}
          startContent={
            <Phone className="h-4 w-4 text-gray-400" strokeWidth={1.75} />
          }
        />
        <TextField
          control={control}
          name="password"
          label="Password"
          labelPlacement="outside"
          type={isPassword ? "password" : "text"}
          placeholder="Enter your password"
          variant="bordered"
          radius="md"
          size="lg"
          autoComplete="current-password"
          classNames={{
            label: "text-sm font-medium text-secondary",
            inputWrapper:
              "border-gray-200 bg-white shadow-xs data-[hover=true]:border-gray-300 group-data-[focus=true]:border-primary",
          }}
          startContent={
            <Lock className="h-4 w-4 text-gray-400" strokeWidth={1.75} />
          }
          endContent={
            <PasswordAdornment
              password={isPassword}
              showPassword={onPasswordChange}
            />
          }
        />

        <Button
          radius="md"
          color="primary"
          className="mt-2 h-12 w-full font-semibold text-base shadow-sm transition-shadow hover:shadow-md"
          size="lg"
          type="submit"
          isLoading={loading}
        >
          Sign in
        </Button>
      </form>

      <p className="mt-8 text-center text-xs leading-relaxed text-gray-400">
        Trouble signing in? Contact your administrator for account access.
      </p>
    </div>
  );
}
