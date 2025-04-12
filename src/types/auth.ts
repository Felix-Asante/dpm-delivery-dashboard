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
  isVerified: boolean;
  code?: string | null;
  codeUseCase?: string | null;
  codeExpiryDate: string;
  likes: string[];
  role: Role;
  adminFor?: Place;
}

export interface Rider {
  user: User;
}

export interface Role {
  name: string;
  id: number;
}

export interface Session {
  user: User;
  idToken: string;
}
