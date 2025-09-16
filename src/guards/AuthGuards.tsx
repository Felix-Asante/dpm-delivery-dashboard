import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authentication";
import { redirect } from "next/navigation";
import { Fragment } from "react";
import { Session } from "@/types/auth";
import { NEXT_AUTH_SIGN_IN_URL } from "@/config/routes";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default async function AuthGuard({
  children,
}: Readonly<AuthLayoutProps>) {
  const session = await getServerSession<typeof authOptions, Session>(
    authOptions
  );
  if (!session) {
    redirect(NEXT_AUTH_SIGN_IN_URL);
  }
  return <Fragment>{children}</Fragment>;
}
