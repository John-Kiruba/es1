import { headers } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const res = await fetch("https://dummyjson.com/products/category/groceries", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return Response.json({ data });
}
