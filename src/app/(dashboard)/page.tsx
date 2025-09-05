import { checkUserRole } from "@/lib/auth";
import { HomeAdminView } from "./_home/AdminView";
import { RidersHomeView } from "./_home/RidersHomeView";
import { UserRoles } from "@/config/constants";

export default async function Home() {
  const isCourier = await checkUserRole(UserRoles.COURIER);
  return isCourier ? <RidersHomeView /> : <HomeAdminView />;
}
