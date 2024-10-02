"use server";

import bcrypt from "bcrypt";
import { auth, signIn, signOut } from "@/services/auth";
import { db } from "@/services/db";
import { NewUser, users } from "@/services/db/schemas/user";
import { eq } from "drizzle-orm/expressions";

export async function GetSession() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    signOut();
    throw new Error("User is not logged into the application!!!");
  }

  const userLogged = session.user;
  return userLogged;
}

export async function SignInAssistant({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    await signIn("credentials", { email, password, redirect: false });
    return {
      success: true,
      message: "login successful",
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      message: errorMessage,
    };
  }
}

export async function CreateUser(user: NewUser) {
  try {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, user.email),
    });
    if (existingUser) {
      return {
        success: false,
        message: "E-mail já cadastrado",
      };
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUserData = {
      ...user,
      password: hashedPassword,
    };

    const newUser = await db.insert(users).values(newUserData).returning();
    await signIn("credentials", {
      email: newUser[0].email,
      password: newUser[0].password,
      redirect: false,
    });

    return {
      success: true,
      message: "Usuário criado com sucesso",
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(errorMessage);
  }
}
