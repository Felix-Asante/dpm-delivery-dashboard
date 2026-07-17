import AuthGuards from "@/guards/AuthGuards";
import MainNavbar from "./Navbar";
import { ReactNode } from "react";
import DashboardSideBar from "./sidebars/DashboardSideBar";
import { checkUserRole } from "@/lib/auth";
import { UserRoles } from "@/config/constants";
import { RidersAppLayout } from "@/layouts/RidersAppLayout";

export default async function DashboardLayout({
  children,
}: Readonly<{ children?: ReactNode }>) {
  const isCourier = await checkUserRole(UserRoles.COURIER);
  if (isCourier) return <RidersAppLayout>{children}</RidersAppLayout>;
  return (
    <AuthGuards>
      <main className="min-h-screen bg-gray-50">
        <MainNavbar />
        <DashboardSideBar />
        <div className="min-h-[calc(100vh-4rem)] lg:pl-60">
          {children}
        </div>
      </main>
    </AuthGuards>
  );
}
