import { EyeIcon, EyeOffIcon } from "lucide-react";
import React from "react";

interface PasswordAdornmentProps {
	password: boolean;
	showPassword: (show: boolean) => void;
}

export default function PasswordAdornment({
	password,
	showPassword,
}: PasswordAdornmentProps) {
	return password ? (
		<EyeOffIcon
			className='w-5 h-5 text-gray-500'
			onClick={() => showPassword(false)}
		/>
	) : (
		<EyeIcon
			className='w-5 h-5 text-gray-500'
			onClick={() => showPassword(true)}
		/>
	);
}
