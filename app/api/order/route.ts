import { CartType } from "@/app/context/cart-context";
import { auth } from "@/app/lib/auth";
import { db } from "@/db/index";
import { orderItems, orders } from "@/db/schema";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const body: CartType = await req.json();

  try {
    const [order] = await db
      .insert(orders)
      .values({
        orderNumber: `ORD${Math.floor(Math.random() * 1000000)}`,
        orderDate: new Date().toISOString(),
        status: "pending",
        userId: session.user.id,
      })
      .returning();

    const insertItems = Object.entries(body).map(([_, [quantity, product]]) =>
      db.insert(orderItems).values({
        orderId: order.id,
        itemId: product.id,
        title: product.title,
        price: product.price,
        image: Array.isArray(product.images)
          ? product.images[0] ?? ""
          : product.images,
        quantity,
      })
    );
    //parallel insert ordreitems
    await Promise.all(insertItems);

    return NextResponse.json(
      {
        message: "Order created",
        data: order,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return new NextResponse(`Error: ${error.message}`, { status: 500 });
    }
    return new NextResponse("Unknown error", { status: 500 });
  }
}
