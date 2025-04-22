import { getPlaces } from "@/actions/place";
import PlacesContentSection from "./sections/PlacesContentSection";
import { getCategory } from "@/actions/category";
import WithServerError from "@/components/hoc/WithServerError";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    page?: string;
  }>;
}
export default async function Places({ searchParams }: PageProps) {
  const params = await searchParams;
  const [places, categories] = await Promise.all([
    getPlaces(params),
    getCategory(),
  ]);
  const error = categories?.error ?? places?.error;
  return (
    <WithServerError error={error}>
      <div className="bg-white h-full p-5">
        <PlacesContentSection
          places={places?.results?.items!}
          meta={places?.results?.meta!}
          categories={categories?.results!}
        />
      </div>
    </WithServerError>
  );
}
