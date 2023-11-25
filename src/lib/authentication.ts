import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { apiConfig } from "./apiConfig";
import { apiHandler } from "./apiHandler";
import { User } from "@/types/auth";

interface LoginUser {
	user: User;
	accessToken: string;
}
export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				username: { label: "Username", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials) return null;
				const { username, password } = credentials;

				try {
					const endpoint = apiConfig.auth.login();

					const results = await apiHandler<LoginUser>({
						endpoint,
						method: "POST",
						body: { email: username, password },
					});
					// Return the session object
					return results;
				} catch (error) {
					return null;
				}
			},
		}),
	],
	pages: {
		signIn: "/login",
		signOut: "/signout",
		error: "/error",
		verifyRequest: "/verify-request",
		newUser: "/new-user",
	},
	callbacks: {
		async signIn() {
			return true;
		},
		async jwt({ token, loginResult }: any) {
			if (loginResult && loginResult !== undefined) {
				token.name = loginResult.user?.fullName;
				token.value = loginResult.accessToken;
				delete loginResult?.accessToken;
				token.loginResult = loginResult;
				token.email = loginResult?.user?.email;
				return token;
			}

			return token;
		},

		async session({ session, token }: any) {
			session.user = token.user;
			session.idToken = token.value;
			return session;
		},
		async redirect({ url, baseUrl }) {
			return baseUrl;
		},
	},
	session: {
		maxAge: 86400,
	},
};
