import { NextRequest } from "next/server";

export async function POST(req: NextRequest, res: Response) {
  const body = await req.json();
  console.log(body);
}
