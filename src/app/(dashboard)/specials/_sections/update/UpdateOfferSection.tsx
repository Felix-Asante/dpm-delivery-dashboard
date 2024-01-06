"use client";
import HStack from "@/components/shared/layout/HStack";
import { useReactHookForm } from "@/hooks/useReactHookForm";
import { useServerAction } from "@/hooks/useServerAction";
import { UpdateOffer, updateOfferSchema } from "@/rules/validations/offer";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import CreateOfferContent from "../CreateOfferContent";
import { toast } from "sonner";
import { DASHBOARD_PATHS } from "@/config/routes";
import { getErrorMessage } from "@/utils/helpers";
import { updateOffer } from "@/actions/specials";
import { CreateOfferDto } from "@/types/dtos/offers";
import { Special } from "@/types/specials";

export default function UpdateOfferSection({ offer }: { offer: Special }) {
	const {
		control,
		handleSubmit,
		watch,
		formState: { isValid },
		setValue,
	} = useReactHookForm<CreateOfferDto>(updateOfferSchema);

	const router = useRouter();

	useEffect(() => {
		const {
			id,
			createdAt,
			updatedAt,
			deletedAt,
			type,
			product,
			place,
			...offerDetails
		} = offer;

		setValue("offerType", type?.id);
		setValue("placeId", place?.id);
		Object.keys(offerDetails).forEach((key: any) => {
			if (key.includes("date")) {
				// @ts-ignore
				setValue(key, new Date(offerDetails[key]?.toString()), {
					shouldTouch: true,
				});
			} else {
				// @ts-ignore
				setValue(key, offerDetails[key]?.toString() ?? "", {
					shouldTouch: true,
				});
			}
		});
	}, [offer, setValue]);

	const [runUpdateOffer, { loading }] = useServerAction<
		any,
		typeof updateOffer
	>(updateOffer);

	const onSubmit = async (data: CreateOfferDto) => {
		try {
			await runUpdateOffer(offer?.id, data);
			toast.success("Offer updated successfully");
			router.push(DASHBOARD_PATHS.specials.root);
		} catch (error) {
			toast.error(getErrorMessage(error));
		}
	};

	return (
		<section>
			<HStack className='justify-between mb-3'>
				<h3 className='text-lg font-semibold mb-2'>Update offer</h3>
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
						Update Offer
					</Button>
				</HStack>
			</HStack>
			<div className='bg-white rounded-md p-5'>
				<CreateOfferContent
					control={control}
					watch={watch}
					// selectedPlace={offer?.place}
					// selectedType={offer?.type}
				/>
			</div>
		</section>
	);
}
