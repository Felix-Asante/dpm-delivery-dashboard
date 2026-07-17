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
    status?: string;
    from?: string;
    to?: string;
  }>;
}

export default async function ComplaintsPage({
  searchParams,
}: Readonly<Props>) {
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
    status: params.status,
    from: params.from,
    to: params.to,
  };
  const response = await getComplaintsForAdmin(listParams);

  return (
    <WithServerError error={response?.error}>
      <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="mb-6">
          <p className="text-sm font-medium text-primary">
            Customer operations
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-secondary sm:text-3xl">
            Complaints
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Investigate delivery issues, keep customers informed, and document
            resolutions.
          </p>
        </header>
        <ComplaintsTable data={response?.results} />
      </main>
    </WithServerError>
  );
}
