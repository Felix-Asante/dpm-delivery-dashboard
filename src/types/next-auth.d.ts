import NextAuth from "next-auth";
import { User as IUser } from "./auth";
declare module "next-auth" {
	interface Session {
		user: IUser;
		idToken: string;
	}
	interface User extends IUser {}

	interface JWT {
		idToken?: string;
	}
}
