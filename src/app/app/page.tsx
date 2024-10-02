import { TabsContent } from "@/components/ui/tabs";
import { MeasurePage } from "./_measure-components/measure-page";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { GetSession } from "../auth/actions";
import { UserPage } from "./_user-components/user-page";

const measureFetcher = async () => {
  const response = await fetch(`/api/measures?measure_type=`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
};

export default async function Page() {
  const queryMeasure = new QueryClient();
  await queryMeasure.prefetchQuery({
    queryKey: ["measures"],
    queryFn: () => measureFetcher(),
  });

  const { id } = await GetSession();

  return (
    <main className="w-full p-4">
      <TabsContent value="measures">
        <HydrationBoundary state={dehydrate(queryMeasure)}>
          <MeasurePage />
        </HydrationBoundary>
      </TabsContent>
      <TabsContent value="settings">
        <UserPage id={id as string} />
      </TabsContent>
    </main>
  );
}
