"use client";

import HStack from "@/components/shared/layout/HStack";
import CreateRiderDetails from "./CreateRiderDetails";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { DASHBOARD_PATHS } from "@/config/routes";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@nextui-org/react";

export default function CreateRiderSection() {
  const {
    control,
    setValue,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const loading = false;

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <div>
      <CreateRiderDetails
        control={control}
        setValue={setValue}
        register={register}
        errors={errors}
      />
      <HStack className="items-center">
        <Link
          href={loading ? "#" : DASHBOARD_PATHS.riders.root}
          className={buttonVariants({
            variant: "outline",
            className: "rounded-none border border-border h-[2rem]",
            size: "sm",
          })}
        >
          Cancel
        </Link>
        <Button
          onClick={handleSubmit(onSubmit)}
          color="primary"
          radius="none"
          size="sm"
          isLoading={loading}
        >
          Save
        </Button>
      </HStack>
    </div>
  );
}
