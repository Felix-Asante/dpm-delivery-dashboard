import { Avatar, Select, SelectItem } from "@nextui-org/react";
import { LucideIcon } from "lucide-react";
import React from "react";
import { useController } from "react-hook-form";

interface Options {
	label: string;
	value: string;
	key?: string;
	image?: string;
	onClick?: () => void;
}
interface SelectInputProps {
	options: Options[];
	control: any;
	defaultValue?: string;
	name: string;
	label?: string;
	placeholder?: string;
	size?: "sm" | "md" | "lg";
}
export default function SelectInput(props: SelectInputProps) {
	const {
		options,
		control,
		defaultValue,
		name,
		label,
		placeholder,
		size = "md",
	} = props;

	const { field, fieldState } = useController({
		name,
		defaultValue,
		control,
	});
	return (
		<Select
			items={options}
			label={label}
			placeholder={placeholder || "Select an option"}
			labelPlacement='outside'
			//   className="max-w-xs"
			errorMessage={fieldState?.error?.message}
			variant='bordered'
			radius='sm'
			size={size}
			{...field}
		>
			{(option) => (
				<SelectItem
					key={option?.key ?? option.label}
					textValue={option.value}
					onClick={option.onClick ? option.onClick : undefined}
				>
					<div className='flex gap-2 items-center'>
						{option?.image && (
							<Avatar
								alt={option.label}
								className='flex-shrink-0'
								size='sm'
								src={option.image}
							/>
						)}
						<div className='flex flex-col'>
							<span className='text-small'>{option.label}</span>
						</div>
					</div>
				</SelectItem>
			)}
		</Select>
	);
}
