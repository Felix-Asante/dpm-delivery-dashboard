import React from "react";
import LoginForm from "./LoginForm";
import Image from "next/image";
import GuestGuards from "@/guards/GuestGuards";
const delivery_photo = "/images/welcome-banner.png";
export default function LoginPage() {
	return (
		<GuestGuards>
			<div className='flex flex-col md:flex-row items-center justify-center h-screen md:p-10 gap-8'>
				<div className='md:w-1/2'>
					<div className='max-w-full w-[230px] h-[230px] md:hidden relative'>
						<Image
							src={delivery_photo}
							alt='welcome-banner-image'
							fill
							unoptimized
							className='object-fit'
						/>
					</div>
					<LoginForm />
				</div>
				<section className='hidden md:flex flex-col w-1/2 bg-primary/40 rounded-2xl p-3  items-center justify-center h-full'>
					<Image
						src={delivery_photo}
						alt='welcome-banner-image'
						width={400}
						height={400}
						unoptimized
					/>
					<h3 className='font-medium text-lg  text-center w-[70%] mx-auto text-black'>
						Elevate your delivery game with{" "}
						<span className='font-semibold'>simplicity and precision. </span>
						Let&apos;s get started!
					</h3>
				</section>
			</div>
		</GuestGuards>
	);
}
