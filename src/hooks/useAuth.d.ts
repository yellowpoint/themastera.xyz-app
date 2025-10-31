import type { FC, ReactNode } from "react";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  level?: string;
  points?: number;
  earnings?: number;
}

export interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signUp: (params: any) => Promise<any>;
  signIn: (params: any) => Promise<any>;
  signOut: (options?: any) => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  updateProfile: (updates: any) => Promise<any>;
}

export const AuthProvider: FC<{ children: ReactNode }>;
export function useAuth(): AuthContextValue;