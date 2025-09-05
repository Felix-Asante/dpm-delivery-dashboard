import AuthGuards from "@/guards/AuthGuards";
import MainNavbar from "./Navbar";
import { ReactNode } from "react";
import DashboardSideBar from "./sidebars/DashboardSideBar";
import { checkUserRole } from "@/lib/auth";
import { UserRoles } from "@/config/constants";
import { RidersAppLayout } from "@/layouts/RidersAppLayout";

export default async function DashboardLayout({
  children,
}: {
  children?: ReactNode;
}) {
  const isCourier = await checkUserRole(UserRoles.COURIER);
  if (isCourier) return <RidersAppLayout>{children}</RidersAppLayout>;
  return (
    <AuthGuards>
      <main className="min-h-screen">
        <MainNavbar />

        <DashboardSideBar />
        <div className="ml-[3.2rem] sm:ml-[5.3rem] lg:ml-[11.3rem] h-full">
          {children}
        </div>
      </main>
    </AuthGuards>
  );
}
