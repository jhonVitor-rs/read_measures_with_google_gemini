"use server";

import { GetSession } from "@/app/auth/actions";
import { db } from "@/services/db";
import { User, users } from "@/services/db/schemas/user";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { signOut } from "@/services/auth";
import { measures } from "@/services/db/schemas/measure";

export async function GetUser() {
  try {
    const session = await GetSession();

    const user = await db.query.users.findFirst({
      where: eq(users.id, session.id as string),
    });
    if (user) return user;
    else throw new Error("Usuário não encontrado");
  } catch (error) {
    throw error;
  }
}

export async function UpdateUser(
  id: string,
  user: Partial<User>,
  newPassword?: string,
) {
  try {
    const session = await GetSession();

    if (id !== session.id) {
      throw new Error("Id do usuário imcopativel com a sessão");
    }

    if ((user.password && !newPassword) || (!user.password && newPassword)) {
      throw new Error("Tipo de entrada invalida");
    }

    if (user.password !== "" && newPassword !== "") {
      const userData = await db.query.users.findFirst({
        where: eq(users.id, id),
      });
      if (!userData)
        throw new Error("Impossivel atualizar senha, usuário não encontrado");

      const isEqualPassword = await bcrypt.compare(
        user.password as string,
        userData.password,
      );
      if (!isEqualPassword) {
        throw new Error("Senha não confere com sua senha atual");
      }

      if (newPassword) {
        user.password = await bcrypt.hash(newPassword, 10);
      }
    }

    const updateUser = await db
      .update(users)
      .set(user)
      .where(eq(users.id, id))
      .returning();

    if (!updateUser || updateUser.length <= 0) {
      throw new Error("Falha ao atualizar usuário");
    }

    return updateUser[0];
  } catch (error) {
    throw error;
  }
}

export async function SignOut() {
  try {
    await signOut();
  } catch (error) {
    throw error;
  }
}

export async function DeleteUser(id: string) {
  try {
    await GetSession();

    const deleteUser = await db.delete(users).where(eq(users.id, id));
    if (!deleteUser) throw new Error("Falha ao deletar usuário");

    await signOut();
    await db.delete(measures).where(eq(measures.userId, id));

    return { success: true };
  } catch (error) {
    throw error;
  }
}
