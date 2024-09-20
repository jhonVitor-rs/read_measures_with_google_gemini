import { auth } from "@/services/auth";
import { db } from "@/services/db";
import { User, users } from "@/services/db/schemas/user";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.id !== params.id) {
      return NextResponse.json(
        {
          error_code: "UNAUTHORIZED",
          error_description: "Você não está devidamente logado no sistema",
        },
        { status: 401 },
      );
    }
    const data: Partial<User> = await req.json();

    const updateUser = await db
      .update(users)
      .set(data)
      .where(eq(users.id, params.id))
      .returning();

    if (!updateUser || updateUser.length === 0) {
      return NextResponse.json(
        {
          error_code: "INVALID_DATA",
          error_description: "Falha ao atualizar usuário",
        },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true, user: updateUser[0] });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error_code: "INTERNAL_SERVER_ERROR",
        error_description: "Falha ao atualizar usuário",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.id !== params.id) {
      return NextResponse.json(
        {
          error_code: "UNAUTHORIZED",
          error_description: "Você não está devidamente logado no sistema",
        },
        { status: 401 },
      );
    }

    await db.delete(users).where(eq(users.id, params.id));

    return NextResponse.json({
      seuccess: true,
      message: "Usuário deletado com sucesso",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error_code: "INTERNAL_SERVER_ERROR",
        error_description: "Falha ao deletar usuário",
      },
      { status: 500 },
    );
  }
}
