"use client";
import React from "react";
import { useController } from "react-hook-form";
import { cn } from "@/utils/helpers";
import { Input, InputProps } from "@nextui-org/react";

interface TextFieldProps extends InputProps {
	type?: string;
	className?: string;
	name: string;
	control: any;
	rules?: any;
}

export default function TextField(props: TextFieldProps) {
	const {
		label,
		type = "text",
		className = "",

		name,
		control,
		defaultValue,
		placeholder,
		rules,
		isReadOnly,
		disabled,
	} = props;

	const { field, fieldState } = useController({
		name,
		control,
		defaultValue,
		rules,
	});

	return (
		<div className='relative mt-1 '>
			<Input
				{...props}
				type={type}
				name={name}
				className={cn(className)}
				placeholder={placeholder}
				defaultValue={defaultValue}
				onChange={field.onChange}
				value={field.value}
				disabled={disabled}
				readOnly={isReadOnly}
				isInvalid={fieldState?.error?.message!?.length > 0}
				errorMessage={fieldState.error?.message}
			/>
		</div>
	);
}
