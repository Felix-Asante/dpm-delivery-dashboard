"use client";

import HStack from "@/components/shared/layout/HStack";
import CreateRiderDetails from "./CreateRiderDetails";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { DASHBOARD_PATHS } from "@/config/routes";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@nextui-org/react";
import { RiderDto, riderValidations } from "@/rules/validations/rider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useServerAction } from "@/hooks/useServerAction";
import { createRider } from "@/actions/riders";
import { getErrorMessage } from "@/utils/helpers";
import { toast } from "sonner";
import { useRouter } from "next13-progressbar";

export default function CreateRiderSection() {
  const {
    control,
    setValue,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<RiderDto>({
    resolver: zodResolver(riderValidations),
  });

  const [createNewRider, { loading }] = useServerAction<
    any,
    typeof createRider
  >(createRider);

  const router = useRouter();

  const onSubmit = async (data: RiderDto) => {
    try {
      const { identificationDocumentImage, bikeImage, ...rest } = data;

      const formData = new FormData();

      for (const key in rest) {
        // @ts-ignore
        formData.append(key, rest[key]);
      }
      formData.append(
        "identificationDocumentImage",
        identificationDocumentImage[0] as unknown as File
      );
      formData.append("bikeImage", bikeImage[0] as unknown as File);

      const response = await createNewRider(formData);
      if (response?.error) {
        toast.error(response.error);
        return;
      }
      toast.success("New rider created");
      router.push(DASHBOARD_PATHS.riders.root);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
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
