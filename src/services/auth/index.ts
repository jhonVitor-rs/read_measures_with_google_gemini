import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { users } from "../db/schemas/user";
import { db } from "../db";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email as string),
        });

        if (!user) throw new Error("Email e/ou senha invalido(s)");

        const authorized = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );
        if (!authorized) throw new Error("Email e/ou senha invalido(s)");

        return user;
      },
    }),
  ],
});
