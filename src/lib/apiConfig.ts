export const apiConfig = {
	baseUrl: process.env.API_URL,
	auth: {
		login: () => "auth/login",
	},
};
