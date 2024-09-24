import { TabsContent } from "@/components/ui/tabs";
import { MeasurePage } from "./_measure-components/measure-page";

export default function Page() {
  return (
    <main className="w-full p-4">
      <TabsContent value="measures">
        <MeasurePage />
      </TabsContent>
      <TabsContent value="settings">Configurações</TabsContent>
    </main>
  );
}
