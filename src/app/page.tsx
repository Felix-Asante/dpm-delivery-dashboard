"use client";
import { Button } from "@nextui-org/react";

export default function Home() {
	return (
		<main className='flex min-h-screen flex-col items-center justify-between p-24'>
			<Button color='primary' radius='sm' disableRipple>
				Dashboard
			</Button>
		</main>
	);
}
