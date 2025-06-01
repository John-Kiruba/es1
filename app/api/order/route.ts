import { CartType } from "@/app/context/cart-context";
import { auth } from "@/app/lib/auth";
import { db } from "@/db/index";
import { orderItems, orders } from "@/db/schema";
import type { Session } from "better-auth";
import { eq, and, desc } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const existingOrder = async (session: { userId: string }) => {
  return await db.query.orders.findFirst({
    where: (table, { eq, and }) =>
      and(eq(table.status, "pending"), eq(table.userId, session.userId)),
    orderBy: (table, { desc }) => [desc(table.orderDate)],
  });
};

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const cart: CartType = await req.json();

  try {
    // Step 1: Try to find existing pending order
    let pendingOrder = await existingOrder({ userId: session.user.id });

    // Case 1: No pending order — create a new one and insert all items
    if (!pendingOrder) {
      const [newOrder] = await db
        .insert(orders)
        .values({
          orderNumber: `ORD${Math.floor(Math.random() * 1000000)}`,
          orderDate: new Date().toISOString(),
          status: "pending",
          userId: session.user.id,
        })
        .returning();

      const inserts = Object.entries(cart).map(([_, [quantity, product]]) => ({
        orderId: newOrder.id,
        itemId: product.id,
        title: product.title,
        price: product.price,
        image: Array.isArray(product.images)
          ? product.images[0] ?? ""
          : product.images,
        quantity,
      }));

      if (inserts.length > 0) {
        await db.insert(orderItems).values(inserts);
      }

      return NextResponse.json(
        { message: "Order created", data: newOrder },
        { status: 201 }
      );
    }

    // Case 2: Existing pending order — fetch existing items
    const existingItems = await db.query.orderItems.findMany({
      where: (table, { eq }) => eq(table.orderId, pendingOrder.id),
    });

    const existingMap = new Map(
      existingItems.map((item) => [item.itemId, item])
    );

    const inserts = [];
    const updates = [];

    for (const [_, [quantity, product]] of Object.entries(cart)) {
      const existing = existingMap.get(product.id);

      if (existing) {
        updates.push({
          id: existing.id,
          newQuantity: existing.quantity + quantity,
        });
      } else {
        inserts.push({
          orderId: pendingOrder.id,
          itemId: product.id,
          title: product.title,
          price: product.price,
          image: Array.isArray(product.images)
            ? product.images[0] ?? ""
            : product.images,
          quantity,
        });
      }
    }

    if (inserts.length > 0) {
      await db.insert(orderItems).values(inserts);
    }

    if (updates.length > 0) {
      await Promise.all(
        updates.map((u) =>
          db
            .update(orderItems)
            .set({ quantity: u.newQuantity })
            .where(eq(orderItems.id, u.id))
        )
      );
    }

    return NextResponse.json(
      { message: "Order updated", data: pendingOrder },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return new NextResponse(`Error: ${error.message}`, { status: 500 });
    }
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const order = await existingOrder({ userId: session.user.id });

    if (!order) {
      return NextResponse.json(
        { error: "No pending order found" },
        { status: 404 }
      );
    }

    const items = await db.query.orderItems.findMany({
      where: (table, { eq }) => eq(table.orderId, order.id),
    });

    return NextResponse.json({
      order,
      items,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Error: ${error.message}` },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
