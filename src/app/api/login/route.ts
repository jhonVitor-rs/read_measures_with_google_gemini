import { NextRequest, NextResponse } from "next/server";
import { signIn } from "next-auth/react";

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

    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    return NextResponse.json({
      success: true,
      message: "Login efetuado com sucesso",
    });
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
