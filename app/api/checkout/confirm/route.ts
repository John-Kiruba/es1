import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems, user, userAddress, userCard } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, userId } = body;
    console.log("body is fine ", orderId, userId);
    if (!orderId || !userId) {
      return NextResponse.json(
        { error: "Missing orderId or userId" },
        { status: 400 }
      );
    }
    console.log("updating  ");

    console.log("Incoming orderId", typeof orderId, orderId);
    console.log("Incoming userId", typeof userId, userId);

    const updated = await db
      .update(orders)
      .set({ status: "paid", updatedAt: new Date() })
      .where(and(eq(orders.id, orderId), eq(orders.userId, userId)));

    console.log("Update result", updated);

    // Update order status to 'paid'
    await db
      .update(orders)
      .set({
        status: "paid",
        updatedAt: new Date(),
      })
      .where(and(eq(orders.id, orderId), eq(orders.userId, userId)));
    console.log("fetch related  ");
    // Fetch order with all related data
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
            updatedAt: true,
          },
          with: {
            userAddress: true,
            // userCard: true,
          },
        },
        orderItems: true,
      },
    });
    console.log("order found  ");
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Order payment updated to paid successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating order payment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
