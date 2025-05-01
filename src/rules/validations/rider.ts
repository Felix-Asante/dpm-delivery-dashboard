import * as z from "zod";
import { emailValidation, passwordValidation } from "./auth";

export const bikeDetailsValidations = z.object({
  bikeRegistrationNumber: z.string(),
  bikeType: z.string(),
  bikeColor: z.string(),
  bikeBrand: z.string(),
  bikeModel: z.string(),
  bikeYear: z.coerce
    .number()
    .min(2000)
    .max(new Date().getFullYear())
    .transform((val) => Number(val)),
  identificationDocumentType: z.string(),
  identificationDocumentNumber: z.string(),
  documentExpiryDate: z.date(),
  bikeImage: z.any(),
  identificationDocumentImage: z.any(),
});

export const riderValidations = z
  .object({
    fullName: z.string().min(3).max(100),
    phone: z.string().min(10).max(15),
    email: emailValidation,
    password: passwordValidation,
    profilePicture: z.any(),
  })
  .and(bikeDetailsValidations);

export type RiderDto = z.infer<typeof riderValidations>;
export type BikeDetailsDto = z.infer<typeof bikeDetailsValidations>;
