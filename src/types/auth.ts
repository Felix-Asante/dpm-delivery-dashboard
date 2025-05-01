import { Place } from "./place";

export interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: any;
  phone: string;
  email?: any;
  fullName: string;
  address?: string | null;
  profilePicture?: string | null;
  isVerified: boolean;
  code?: string | null;
  codeUseCase?: string | null;
  codeExpiryDate: string;
  likes: string[];
  role: Role;
  adminFor?: Place;
}

export interface Rider extends User {
  rider: {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: any;
    bikeRegistrationNumber: string;
    bikeType: string;
    bikeColor: string;
    bikeBrand: string;
    bikeModel: string;
    bikeYear: number;
    bikeImage: string;
    identificationDocumentNumber: string;
    identificationDocumentType: string;
    identificationDocumentImage: string;
    documentExpiryDate: string;
    riderId: string;
  };
}

export interface Role {
  name: string;
  id: number;
}

export interface Session {
  user: User;
  idToken: string;
}
