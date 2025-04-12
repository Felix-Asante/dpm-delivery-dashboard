import { getPlace } from "@/actions/place";
import WithServerError from "@/components/hoc/WithServerError";
import PlaceContent from "./_sections/placeContent";
import PlaceSidebar from "./_sections/PlaceSidebar";

interface PageProps {
  params: Promise<{ placeId: string }>;
}
export default async function PlaceDetailPage(props: PageProps) {
  const params = await props.params;
  const response = await getPlace(params.placeId);

  const error = response?.error;

  return (
    <WithServerError error={error}>
      <div className="flex min-h-screen bg-gray-50">
        <div className="w-1/4 sticky top-0 min-h-full">
          <PlaceSidebar place={response?.results!} />
        </div>
        <div className="w-[75%]">
          <PlaceContent place={response?.results!} />
        </div>
      </div>
    </WithServerError>
  );
}
