import { db } from "@/services/db";
import { NewUser, users } from "@/services/db/schemas/user";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { signIn } from "@/services/auth";

export async function POST(req: NextRequest) {
  try {
    const userData: NewUser = await req.json();
    const errors = validData(userData);

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error_code: "INVALID_DATA", error_description: errors },
        { status: 400 },
      );
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, userData.email),
    });
    if (existingUser) {
      return NextResponse.json(
        {
          error_code: "DOUBLE_REPORT",
          error_description: "E-mail já cadastrado",
        },
        { status: 404 },
      );
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10); // O número 10 é o salt rounds
    const newUserData = {
      ...userData,
      password: hashedPassword,
    };

    const newUser = await db.insert(users).values(newUserData).returning();
    await signIn("credentials", {
      email: newUser[0].email,
      password: newUser[0].password,
      redirect: false,
    });

    return NextResponse.json({ success: true, user: newUser });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error_code: "INTERNAL_SERVER_ERROR",
        error_description: "Falha ao criar usuário",
      },
      { status: 500 },
    );
  }
}

function validData(user: NewUser): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!user.name || user.name.trim().length === 0) {
    errors.name = "O nome é obrigatório";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!user.email || !emailRegex.test(user.email)) {
    errors.email = "Um e-mail válido é obrigatório.";
  }

  if (!user.password || user.password.length < 6) {
    errors.password = "A senha deve ter pelo menos 6 caracteres.";
  }

  return errors;
}
