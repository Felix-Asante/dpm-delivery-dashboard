import WithServerError from "@/components/hoc/WithServerError";
import React from "react";
import UsersListSection from "./_sections/UsersListSection";
import { getUsers } from "@/actions/users";
import { UserRoles } from "@/config/constants";

interface PageProps {
  searchParams: Promise<{ search: string; role: string }>;
}
export default async function UsersPage({ searchParams }: PageProps) {
  const { search = "", role = UserRoles.USER } = await searchParams;
  const users = await getUsers({ query: search, role });
  return (
    <WithServerError error={users?.error}>
      <div className="bg-white h-screen w-full">
        <UsersListSection usersResult={users?.results!} />
      </div>
    </WithServerError>
  );
}
