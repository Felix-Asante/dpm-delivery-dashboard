"use client";
import React from "react";
import CreateOfferContent from "../CreateOfferContent";
import { useReactHookForm } from "@/hooks/useReactHookForm";

export default function CreateOfferSection() {
	const { control, handleSubmit, watch } = useReactHookForm({});
	return (
		<div className='bg-white rounded-md p-5'>
			<CreateOfferContent control={control} watch={watch} />
		</div>
	);
}
