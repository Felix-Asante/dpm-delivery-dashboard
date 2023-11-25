import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authentication";
import { Fragment } from "react";
import { Session } from "@/types/auth";

interface AuthLayoutProps {
	children: React.ReactNode;
}
export default async function GuestGuard({ children }: AuthLayoutProps) {
	const session = await getServerSession<typeof authOptions, Session>(
		authOptions,
	);
	if (session) {
		redirect("/");
	}
	return <Fragment>{children}</Fragment>;
}
