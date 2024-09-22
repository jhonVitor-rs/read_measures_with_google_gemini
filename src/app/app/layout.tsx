import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Layout({ children }: { children: React.ReactNode }) {
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
      {children}
    </Tabs>
  );
}
