import AuthGuards from "@/guards/AuthGuards";
import MainNavbar from "./Navbar";
import { ReactNode } from "react";
import HStack from "@/components/shared/layout/HStack";
import DashboardSideBar from "./sidebars/DashboardSideBar";

export default function DashboardLayout({
	children,
}: {
	children?: ReactNode;
}) {
	return (
		<AuthGuards>
			<main className='h-screen'>
				<MainNavbar />

				<DashboardSideBar />
				<div className='lg:ml-[11.3rem] mt-1 pl-20 pr-5 md:pl-24 lg:px-7 pt-7'>
					{children}
				</div>
			</main>
		</AuthGuards>
	);
}
