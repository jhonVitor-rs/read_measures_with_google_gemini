import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen w-full justify-center p-4">
      <Tabs defaultValue="sign-in" className="mt-10 w-full max-w-96">
        <TabsList className="mb-2 w-full">
          <TabsTrigger value="sign-in" className="flex-1">
            Sing In
          </TabsTrigger>
          <TabsTrigger value="sign-up" className="flex-1">
            Sign Up
          </TabsTrigger>
        </TabsList>
        {children}
      </Tabs>
    </main>
  );
}
