import { GetSession } from "@/app/auth/actions";
import { db } from "@/services/db";
import { measures } from "@/services/db/schemas/measure";
import { getMeasureValue, uploadImage } from "@/services/gemini/upload-image";
import { and, eq, gte, lt } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

interface NewMeasure {
  image: string;
  measure_datetime: Date;
  measure_type: "WATER" | "GAS";
}

export async function GET(req: NextRequest) {
  try {
    const session = await GetSession();

    const { searchParams } = new URL(req.url);
    const measureType = searchParams.get("measure_type");
    const validateMeasureType = ["WATER", "GAS"];

    if (
      measureType &&
      !validateMeasureType.includes(measureType.toUpperCase())
    ) {
      return NextResponse.json(
        {
          error_code: "INVALID_TYPE",
          error_description: "Tipo de medição não permitido",
        },
        { status: 400 },
      );
    }

    const measuresDate = await db
      .select()
      .from(measures)
      .where(
        and(
          eq(measures.userId, session.id as string),
          measureType
            ? eq(measures.measureType, measureType.toUpperCase())
            : undefined,
        ),
      );

    if (measuresDate.length <= 0) {
      return NextResponse.json(
        {
          error_code: "MEASURES_NOT_FOUND",
          error_description: "Nenhuma leitura encontrada",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: measuresDate });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error_code: "INTERNAL_SERVER_ERROR", error_description: errorMessage },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await GetSession();
    const measureData: NewMeasure = await req.json();

    const existingMeasure = await verifyExistingMeasure(
      measureData,
      session.id as string,
    );
    if (existingMeasure) {
      return NextResponse.json(
        {
          error_code: "DOUBLE_REPORT",
          error_description: "Leitura do mês ja realizada",
        },
        { status: 409 },
      );
    }

    const { image_url, mime_type } = await uploadImage(measureData.image);
    const measure_value = await getMeasureValue(mime_type, image_url);

    const newMeasure = await db
      .insert(measures)
      .values({
        userId: session.id as string,
        measureDatetime: measureData.measure_datetime.toISOString(),
        measureType: measureData.measure_type,
        hasConfirmed: false,
        imageUrl: image_url,
        measureValue: measure_value,
      })
      .returning();

    return NextResponse.json({ success: true, data: newMeasure[0] });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error_code: "INTERNAL_SERVER_ERROR", error_description: errorMessage },
      { status: 500 },
    );
  }
}

async function verifyExistingMeasure(measure: NewMeasure, userId: string) {
  try {
    const startOfMonth = new Date(
      new Date(measure.measure_datetime).getFullYear(),
      new Date(measure.measure_datetime).getMonth(),
      1,
    ).toISOString();
    const startOfNextMonth = new Date(
      new Date(measure.measure_datetime).getFullYear(),
      new Date(measure.measure_datetime).getMonth() + 1,
      1,
    ).toISOString();

    const existingMeasure = await db.query.measures.findFirst({
      where: and(
        eq(measures.userId, userId),
        eq(measures.measureType, measure.measure_type),
        gte(measures.measureDatetime, startOfMonth),
        lt(measures.measureDatetime, startOfNextMonth),
      ),
    });

    if (typeof existingMeasure === "undefined" || !existingMeasure) return null;
    return existingMeasure;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(errorMessage);
  }
}
