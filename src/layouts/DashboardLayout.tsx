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
			<main className='min-h-screen'>
				<MainNavbar />

				<DashboardSideBar />
				<div className='ml-[3.2rem] sm:ml-[5.3rem] lg:ml-[11.3rem] h-full'>
					{children}
				</div>
			</main>
		</AuthGuards>
	);
}
