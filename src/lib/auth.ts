"use server";

import { Session } from "@/types/auth";
import { authOptions } from "./authentication";
import { getServerSession } from "next-auth";

export async function getUserRole() {
	const session = await getServerSession<typeof authOptions, Session>(
		authOptions,
	);

	return session?.user.role.name;
}
export async function checkUserRole(role: string) {
	const userRole = await getUserRole();

	return userRole?.toLowerCase() === role?.toLocaleLowerCase();
}
