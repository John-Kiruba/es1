import { authClient } from "@/app/lib/auth-client";
import { redirect } from "next/navigation";

export async function signOut() {
  await authClient.signOut();

  redirect("/signin");
}
