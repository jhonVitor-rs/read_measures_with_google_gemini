import { TabsContent } from "@/components/ui/tabs";

export default function Page() {
  return (
    <main className="w-full">
      <TabsContent value="measures">Measures</TabsContent>
      <TabsContent value="settings">Configurações</TabsContent>
    </main>
  );
}
