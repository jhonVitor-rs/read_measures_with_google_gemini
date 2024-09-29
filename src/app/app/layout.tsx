import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const fetcher = async () => {
  const response = await fetch(`/api/measures?measure_type=`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["measures"],
    queryFn: () => fetcher(),
  });
  return (
    <Tabs defaultValue="measures" className="flex min-h-screen w-full flex-row">
      <TabsList className="flex min-h-screen w-64 flex-col items-start justify-start gap-4 rounded-none px-2 py-4">
        <TabsTrigger
          value="measures"
          className="w-full items-start text-2xl font-bold"
        >
          Medições
        </TabsTrigger>
        <TabsTrigger
          value="settings"
          className="w-full items-start text-2xl font-bold"
        >
          Configurações
        </TabsTrigger>
      </TabsList>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TooltipProvider>{children}</TooltipProvider>
      </HydrationBoundary>
    </Tabs>
  );
}
