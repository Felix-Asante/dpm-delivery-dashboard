import { getComplaintsForAdmin } from "@/actions/complaints";
import { UserRoles } from "@/config/constants";
import { checkUserRole } from "@/lib/auth";
import WithServerError from "@/components/hoc/WithServerError";
import { notFound } from "next/navigation";
import ComplaintsTable from "./_sections/ComplaintsTable";

interface Props {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    query?: string;
    category?: string;
    from?: string;
    to?: string;
  }>;
}

export default async function ComplaintsPage({ searchParams }: Props) {
  const isAdmin = await checkUserRole(UserRoles.ADMIN);
  if (!isAdmin) {
    notFound();
  }

  const params = await searchParams;
  const listParams = {
    page: params.page,
    limit: params.limit || "20",
    query: params.query,
    category: params.category,
    from: params.from,
    to: params.to,
  };
  const response = await getComplaintsForAdmin(listParams);

  return (
    <WithServerError error={response?.error}>
      <div className="p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Complaints</h1>
          <p className="text-gray-500 mt-1">
            All customer delivery complaints and linked orders
          </p>
        </div>
        <ComplaintsTable data={response?.results} />
      </div>
    </WithServerError>
  );
}
