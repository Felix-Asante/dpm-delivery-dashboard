"use client";
import VStack from "@/components/shared/layout/VStack";
import { SIDEBAR_NAVIGATION } from "@/config/constants/navigations";
import { cn, parsePathname } from "@/utils/helpers";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function DashboardSideBar() {
	const pathname = parsePathname(usePathname());

	return (
		<aside className='bg-white border-r border-gray-200 h-full py-8 fixed top-[3.8rem]'>
			<VStack className='gap-2'>
				{SIDEBAR_NAVIGATION.map((nav) => {
					const isActive = pathname[0].href === nav.href;
					return (
						<Link
							key={nav.label}
							href={nav.href}
							className={cn(
								"flex items-center py-3 px-3 sm:pl-6 sm:pr-8 gap-5 hover:bg-primary/5 [&>svg]:text-gray-400 font-bold",
								isActive &&
									"border-primary border-r-2 bg-primary/5 [&>*]:!text-primary",
							)}
						>
							<nav.icon size={25} />
							<span className='hidden lg:block'>{nav.label}</span>
						</Link>
					);
				})}
			</VStack>
		</aside>
	);
}
