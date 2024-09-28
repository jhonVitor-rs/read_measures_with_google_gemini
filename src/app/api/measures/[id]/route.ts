import { GetSession } from "@/app/auth/actions";
import { db } from "@/services/db";
import { measures } from "@/services/db/schemas/measure";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await GetSession();

    const measure = await db.query.measures.findFirst({
      where: eq(measures.id, params.id),
    });
    if (!measure) {
      return NextResponse.json(
        {
          error_code: "MEASURE_NOT_FOUND",
          error_description: "Leitura do mes já realizada",
        },
        { status: 404 },
      );
    }
    if (measure.hasConfirmed) {
      return NextResponse.json(
        {
          error_code: "CONFIRMATION_DUPLICATE",
          error_description: "Leitura do mês ja confirmada.",
        },
        { status: 409 },
      );
    }

    const { confirmed_value }: { confirmed_value?: number } = await req.json();
    const updatedValue =
      confirmed_value !== undefined ? confirmed_value : measure.measureValue;

    await db
      .update(measures)
      .set({ measureValue: updatedValue, hasConfirmed: true })
      .where(eq(measures.id, params.id));

    return NextResponse.json({
      success: true,
      message: "Medição atualizada com sucesso",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error_code: "INTERNAL_SERVER_ERROR", error_description: errorMessage },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await GetSession();

    const measure = await db.query.measures.findFirst({
      where: eq(measures.id, params.id),
    });

    if (!measure) {
      return NextResponse.json(
        {
          error_code: "MEASURE_NOT_FOUND",
          error_description: "Leitura não encontrada.",
        },
        { status: 404 },
      );
    }

    await db.delete(measures).where(eq(measures.id, params.id));

    return NextResponse.json({
      success: true,
      message: "Medição excluída com sucesso.",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error_code: "INTERNAL_SERVER_ERROR", error_description: errorMessage },
      { status: 500 },
    );
  }
}
