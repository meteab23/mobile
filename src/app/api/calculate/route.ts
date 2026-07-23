import { NextResponse } from "next/server";
import { calculatePaymentTerms } from "@/lib/calculations";
import { feeCalculationSchema } from "@/lib/validations";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = feeCalculationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid calculation payload",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const result = calculatePaymentTerms(parsed.data);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to calculate payment terms" },
      { status: 500 }
    );
  }
}
