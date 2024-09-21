import { Card } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { SignIn } from "./_components/sign-in";
import { SignUp } from "./_components/sign-up";

export default function AuthPage() {
  return (
    <Card>
      {/* joao.siben@email.com 0123456789 */}
      <TabsContent value="sign-in">
        <SignIn />
      </TabsContent>
      <TabsContent value="sign-up">
        <SignUp />
      </TabsContent>
    </Card>
  );
}
