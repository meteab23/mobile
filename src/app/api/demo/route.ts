import { NextResponse } from "next/server";
import { demoRequestSchema } from "@/lib/validations";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = demoRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid demo request",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    // Mock handler — would enqueue CRM / sales outreach in production
    return NextResponse.json({
      success: true,
      message: "Demo request received. A specialist will reach out shortly.",
      data: {
        ...parsed.data,
        referenceId: `demo_${Date.now().toString(36)}`,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to schedule demo" },
      { status: 500 }
    );
  }
}
