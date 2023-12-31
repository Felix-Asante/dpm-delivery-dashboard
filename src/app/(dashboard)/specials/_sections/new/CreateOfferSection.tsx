"use client";
import React from "react";
import CreateOfferContent from "../CreateOfferContent";
import { useReactHookForm } from "@/hooks/useReactHookForm";
import HStack from "@/components/shared/layout/HStack";
import { Button } from "@nextui-org/react";
import { createOfferSchema } from "@/rules/validations/offer";
import { CreateOfferDto } from "@/types/dtos/offers";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import { useServerAction } from "@/hooks/useServerAction";
import { createOffer } from "@/actions/specials";
import { DASHBOARD_PATHS } from "@/config/routes";

export default function CreateOfferSection() {
	const {
		control,
		handleSubmit,
		watch,
		formState: { isValid },
	} = useReactHookForm<CreateOfferDto>(createOfferSchema);

	const router = useRouter();

	const [runCreateOffer, { loading }] = useServerAction<
		any,
		typeof createOffer
	>(createOffer);

	const onSubmit = async (data: CreateOfferDto) => {
		try {
			await runCreateOffer(data);
			toast.success("Offer created successfully");
			router.push(DASHBOARD_PATHS.specials.root);
		} catch (error) {
			toast.error(getErrorMessage(error));
		}
	};
	return (
		<section>
			<HStack className='justify-between mb-3'>
				<h3 className='text-lg font-semibold mb-2'>Create new place</h3>
				<HStack className='justify-end'>
					<Button
						className='text-white'
						color='success'
						size='sm'
						radius='none'
						disableRipple
						onClick={() => router.back()}
						isDisabled={loading}
					>
						Cancel
					</Button>
					<Button
						size='sm'
						radius='none'
						color='primary'
						disableRipple
						isDisabled={!isValid}
						isLoading={loading}
						onClick={handleSubmit(onSubmit)}
					>
						Create Offer
					</Button>
				</HStack>
			</HStack>
			<div className='bg-white rounded-md p-5'>
				<CreateOfferContent control={control} watch={watch} />
			</div>
		</section>
	);
}
