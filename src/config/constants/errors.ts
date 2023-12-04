export const ERRORS = {
	AUTH: {
		PASSWORD: {
			required: "Password required",
			invalid:
				"Password must contain at least one uppercase, lowercase, numbers and some special characters",
			min: "Password must contain at least 8 characters",
			misMatch: "Passwords don't match",
		},
		EMAIL: {
			required: "Email required",
			invalid: "Email is invalid",
		},
		PHONE: {
			required: "Phone required",
			invalid: "Phone is invalid",
		},
	},
	MESSAGE: {
		NETWORK: "Network Error",
	},
};
