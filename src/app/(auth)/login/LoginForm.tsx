"use client";
import PasswordAdornment from "@/components/shared/adornments/PasswordAdornment";
import TextField from "@/components/shared/input/TextField";
import { useReactHookForm } from "@/hooks/useReactHookForm";
import { LoginFormFields, loginValidations } from "@/rules/validations/auth";
import { Button } from "@nextui-org/react";
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
		}).then(({ ok, error, status, url }: any) => {
			if (!error) {
				router.replace("/");
			} else {
				toast.error("Incorrect username or password.");
				setLoading(false);
			}
		});
	};

	return (
		<div className='flex flex-col md:w-[85%] mx-auto'>
			<h3 className='text-2xl lg:text-4xl font-bold text-black capitalize text-center'>
				Welcome back
			</h3>
			<form className='mt-4 md:mt-12 flex flex-col gap-y-4'>
				<TextField
					control={control}
					name='phone'
					size='sm'
					placeholder='Phone Number'
					variant='bordered'
					radius='full'
				/>
				<TextField
					control={control}
					name='password'
					type={isPassword ? "password" : "text"}
					size='sm'
					placeholder='Password'
					variant='bordered'
					radius='full'
					endContent={
						<PasswordAdornment
							password={isPassword}
							showPassword={onPasswordChange}
						/>
					}
				/>
				<Button
					radius='full'
					color='primary'
					className='mt-2 font-bold'
					size='lg'
					onClick={handleSubmit(attemptLogin)}
					isLoading={loading}
					type='button'
				>
					Login
				</Button>
			</form>
		</div>
	);
}
