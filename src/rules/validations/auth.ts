import { ERRORS } from "@/config/constants/errors";
import * as z from "zod";
import regexPattern from "..";

export const passwordValidation = z
	.string({
		required_error: ERRORS.AUTH.PASSWORD.required,
		invalid_type_error: ERRORS.AUTH.PASSWORD.invalid,
	})
	.min(8, ERRORS.AUTH.PASSWORD.min);
// .regex(regexPattern.PASSWORD, ERRORS.AUTH.PASSWORD.invalid);

export const emailValidation = z
	.string({
		required_error: ERRORS.AUTH.EMAIL.required,
		invalid_type_error: ERRORS.AUTH.EMAIL.invalid,
	})
	.email(ERRORS.AUTH.EMAIL.invalid);

export const loginValidations = z.object({
	phone: z
		.string({
			required_error: ERRORS.AUTH.PHONE.required,
			invalid_type_error: ERRORS.AUTH.PHONE.invalid,
		})
		.regex(regexPattern.Phone, ERRORS.AUTH.PHONE.invalid),

	password: passwordValidation,
});

export type LoginFormFields = z.infer<typeof loginValidations>;
