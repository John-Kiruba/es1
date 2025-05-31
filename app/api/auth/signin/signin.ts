import { authClient } from "@/app/lib/auth-client";

export const signIn = async (email: string, password: string) => {
  const { data, error } = await authClient.signIn.email({
    email,
    password,
    callbackURL: "/home",
    rememberMe: false,
  });
};
