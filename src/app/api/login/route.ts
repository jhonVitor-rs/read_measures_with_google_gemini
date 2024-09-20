import { db } from "@/services/db";
import { users } from "@/services/db/schemas/user";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const data: { email: string; password: string } = await req.json();
    if (!data.email || !data.password) {
      return NextResponse.json(
        {
          error_code: "UNAUTHORIZED",
          error_description: "Emai/ e/ou senha invalidos",
        },
        { status: 401 },
      );
    }

    const user = await db.query.users.findFirst({
      where: eq(users.email, data.email),
    });
    if (!user) {
      return NextResponse.json(
        {
          error_code: "UNAUTHORIZED",
          error_description: "Emai/ e/ou senha invalidos",
        },
        { status: 401 },
      );
    }

    const authorized = await bcrypt.compare(data.password, user.password);
    if (!authorized) {
      return NextResponse.json(
        {
          error_code: "UNAUTHORIZED",
          error_description: "Emai/ e/ou senha invalidos",
        },
        { status: 401 },
      );
    }

    return NextResponse.json({ success: true, user: user });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error_code: "BAD_REQUEST",
        error_description: "Emai/ e/ou senha invalidos",
      },
      { status: 400 },
    );
  }
}
