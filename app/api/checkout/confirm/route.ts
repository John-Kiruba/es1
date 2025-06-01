import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems, user, userAddress, userCard } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, userId } = body;

    if (!orderId || !userId) {
      return NextResponse.json(
        { error: "Missing orderId or userId" },
        { status: 400 }
      );
    }

    // Update order status to 'paid'
    await db
      .update(orders)
      .set({
        status: "paid",
        updatedAt: new Date(),
      })
      .where(and(eq(orders.id, orderId), eq(orders.userId, userId)));

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
