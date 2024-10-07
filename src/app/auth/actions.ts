"use server";

import bcrypt from "bcrypt";
import { auth, signIn, signOut } from "@/services/auth";
import { db } from "@/services/db";
import { NewUser, users } from "@/services/db/schemas/user";
import { eq } from "drizzle-orm/expressions";
import { AuthError } from "next-auth";

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
    let errorMessage: string;
    if (error instanceof AuthError) {
      errorMessage = error.cause?.err?.message as string;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = String(error);
    }
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
      throw new Error("E-mail já cadastrado");
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUserData = {
      ...user,
      password: hashedPassword,
    };

    const newUser = await db.insert(users).values(newUserData).returning();
    await signIn("credentials", {
      email: user.email,
      password: user.password,
      redirect: false,
    });

    return newUser[0];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(errorMessage);
  }
}
