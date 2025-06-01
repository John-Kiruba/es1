import { auth } from "@/app/lib/auth";
import { db } from "@/db";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

function formatExpiryDate(timestamp: string | number | Date) {
  const date = new Date(timestamp);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);
  return `${month}/${year}`;
}
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch user basic info
    const user = await db.query.user.findFirst({
      where: (table, { eq }) => eq(table.id, session.user.id),
      columns: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch card info
    const card = await db.query.userCard.findFirst({
      where: (table, { eq }) => eq(table.userId, user.id),
      columns: {
        cardNumber: true,
        expiryDate: true,
        // omit cvv for security
      },
    });

    // Fetch address + phoneNumber info
    const address = await db.query.userAddress.findFirst({
      where: (table, { eq }) => eq(table.userId, user.id),
      columns: {
        phoneNumber: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
      },
    });

    return NextResponse.json({
      name: user.name,
      email: user.email,
      phoneNumber: address?.phoneNumber?.toString() || "", // convert integer to string
      address: address?.address || "",
      city: address?.city || "",
      state: address?.state || "",
      zipCode: address?.zipCode?.toString() || "",
      cardNumber: card?.cardNumber || "",
      expiryDate: card ? formatExpiryDate(card.expiryDate) : "",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
