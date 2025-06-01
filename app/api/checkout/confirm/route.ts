import { NextResponse } from "next/server";
import { db } from "@/db"; // your drizzle db instance
import { orders } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // For example, body should include orderId, userId, etc.
    const { orderId, userId } = body;

    if (!orderId || !userId) {
      return NextResponse.json(
        { error: "Missing orderId or userId" },
        { status: 400 }
      );
    }

    // Update order status to 'paid' and maybe store updated timestamp
    await db
      .update(orders)
      .set({
        status: "paid",
        updatedAt: new Date(),
      })
      .where(and(eq(orders.id, orderId), eq(orders.userId, userId)));

    // Fetch updated order details with items (optional)
    const updatedOrder = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
    });

    return NextResponse.json({
      message: "Order payment updated to paid successfully",
      order: updatedOrder,
      // items: orderItems,
    });
  } catch (error) {
    console.error("Error updating order payment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
