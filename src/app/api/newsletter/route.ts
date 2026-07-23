import { NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/validations";

export const runtime = "edge";

// In-memory store for demo purposes
const subscribers = new Set<string>();

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = newsletterSchema.safeParse(body);

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        {
          error: firstIssue?.message ?? "Invalid newsletter payload",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const email = parsed.data.email.toLowerCase();

    if (subscribers.has(email)) {
      return NextResponse.json({
        success: true,
        message: "You're already subscribed.",
      });
    }

    subscribers.add(email);

    return NextResponse.json({
      success: true,
      message: "Thanks — we'll send the next briefing your way.",
      data: {
        email,
        company: parsed.data.company ?? null,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to subscribe right now" },
      { status: 500 }
    );
  }
}
