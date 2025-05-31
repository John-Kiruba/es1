import { authClient } from "@/app/lib/auth-client";
import { redirect } from "next/navigation";
import dp from "@/public/dp.jpg";

export const signUp = async ({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}) => {
  const { data, error } = await authClient.signUp.email({
    email,
    password,
    name,
    image: dp.src,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/home");
};
