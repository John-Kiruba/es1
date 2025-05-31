import { auth } from "@/app/lib/auth";
import { db } from "@/db/index";
import { orders } from "@/db/schema";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  try {
    await db.insert(orders).values({
      orderNumber: `ORD${Math.floor(Math.random() * 1000000)}`,
      orderDate: new Date().toISOString(),
      status: "pending",
      userId: session.user.id,
    });

    return new NextResponse("Order created", { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return new NextResponse(`Error: ${error.message}`, { status: 500 });
    }
    return new NextResponse("Unknown error", { status: 500 });
  }
}
