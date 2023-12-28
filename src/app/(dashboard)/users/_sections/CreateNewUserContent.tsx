import { createUser } from "@/actions/users";
import PasswordAdornment from "@/components/shared/adornments/PasswordAdornment";
import TextField from "@/components/shared/input/TextField";
import VStack from "@/components/shared/layout/VStack";
import { useReactHookForm } from "@/hooks/useReactHookForm";
import { useServerAction } from "@/hooks/useServerAction";
import { SignupFields, signupValidationSchema } from "@/rules/validations/auth";
import { generateRandomPassword, getErrorMessage } from "@/utils/helpers";
import { Button } from "@nextui-org/react";
import React, { useState } from "react";
import { toast } from "sonner";

export default function CreateNewUserContent() {
	const {
		control,
		handleSubmit,
		formState: { isValid },
		setValue,
		reset,
	} = useReactHookForm<SignupFields>(signupValidationSchema);

	const [isPassword, setIsPassword] = useState(true);

	const [runCreateUser, { loading }] = useServerAction<any, typeof createUser>(
		createUser,
	);

	const onSubmit = async (data: SignupFields) => {
		try {
			await runCreateUser(data);
			reset();
			toast.success("New user created");
		} catch (error) {
			toast.error(getErrorMessage(error));
		}
	};

	const getRandomPassword = () => {
		const password = generateRandomPassword(8);
		setValue("password", password);
		setIsPassword(false);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<VStack className='gap-4 mb-3'>
				<TextField
					control={control}
					name='fullName'
					label='Full Name'
					placeholder='Full Name'
					labelPlacement='outside'
					radius='sm'
					variant='bordered'
				/>
				<TextField
					control={control}
					name='phone'
					label='Phone Number'
					radius='sm'
					variant='bordered'
					placeholder='Phone Number'
					labelPlacement='outside'
				/>
				<div>
					<TextField
						control={control}
						name='password'
						label='Password'
						type={isPassword ? "password" : "text"}
						radius='sm'
						variant='bordered'
						placeholder='Password'
						labelPlacement='outside'
						endContent={
							<PasswordAdornment
								password={isPassword}
								showPassword={setIsPassword}
							/>
						}
					/>
					<button
						onClick={getRandomPassword}
						className='p-0 text-success font-normal mb-2 mt-px text-sm'
						type='button'
					>
						Generate random password
					</button>
				</div>
				<Button
					color='primary'
					radius='sm'
					disableRipple
					isDisabled={!isValid}
					type='submit'
					isLoading={loading}
				>
					Create user
				</Button>
			</VStack>
		</form>
	);
}
