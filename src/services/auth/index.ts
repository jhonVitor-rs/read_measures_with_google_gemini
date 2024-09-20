import { toast } from "@/hooks/use-toast";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { User } from "../db/schemas/user";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          toast({
            title: errorData.error_code,
            description: errorData.error_description,
            variant: "destructive",
          });
          throw new Error("Failed to login");
        }

        const data: { sucess: boolean; user: User } = await response.json();
        return data.user;
      },
    }),
  ],
});
