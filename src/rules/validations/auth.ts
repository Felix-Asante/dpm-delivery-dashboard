import { ERRORS } from "@/config/constants/errors";
import * as z from "zod";
import regexPattern from "..";

export const passwordValidation = z
  .string({
    required_error: ERRORS.AUTH.PASSWORD.required,
    invalid_type_error: ERRORS.AUTH.PASSWORD.invalid,
  })
  .min(8, ERRORS.AUTH.PASSWORD.min)
  .regex(regexPattern.PASSWORD, ERRORS.AUTH.PASSWORD.invalid);

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

export const signupValidationSchema = z.object({
  phone: z
    .string({
      required_error: ERRORS.AUTH.PHONE.required,
      invalid_type_error: ERRORS.AUTH.PHONE.invalid,
    })
    .regex(regexPattern.Phone, ERRORS.AUTH.PHONE.invalid),

  password: passwordValidation,
  fullName: z.string({ required_error: "Name is required" }),
});

export type SignupFields = z.infer<typeof signupValidationSchema>;

export const updateUserValidationSchema = z.object({
  fullName: z.string({ required_error: "Name is required" }).optional(),
  address: z.string().optional(),
  phone: z
    .string({
      required_error: ERRORS.AUTH.PHONE.required,
      invalid_type_error: ERRORS.AUTH.PHONE.invalid,
    })
    .regex(regexPattern.Phone, ERRORS.AUTH.PHONE.invalid)
    .optional(),
  email: emailValidation.optional(),
});

export type UpdateUserFields = z.infer<typeof updateUserValidationSchema>;
