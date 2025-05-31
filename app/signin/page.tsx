"use client";

import {
    Form,
    FormField,
    FormItem,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Separator } from "@/components/ui/separator";
import { authClient } from "../lib/auth-client";
import { redirect } from "next/navigation";
import { signIn } from "../api/auth/signin/signin";


export default function SignIn() {
    const { data: session } = authClient.useSession();
    if (session) redirect("/home");

    const FormSchema = z.object({
        email: z.string().email(),
        password: z.string(),
    });

    type TFormSchema = z.infer<typeof FormSchema>;

    const form = useForm<TFormSchema>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async () => {
        const { email, password } = form.getValues();
        await signIn(email, password);
    };
    return (
        <div className="flex items-center justify-center  h-screen w-full  mx-auto">
            <div className="w-1/3 text-4xl italic text-shadow-gray-950">
                esalesone
            </div>
            <Separator orientation="vertical" />
            <div className="w-1/3">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className=" px-10 space-y-4"
                    >
                        <h2 className="text-xl font-sans font-semibold text-center">
                            Ahoy! Lets help you onboard
                        </h2>

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input type="password" placeholder="Password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <button
                            className="w-full hover:cursor-pointer text-center bg-blue-500 rounded-lg p-3 text-white "
                            type="submit"
                        >
                            Signin
                        </button>
                    </form>
                </Form>
            </div>
        </div>
    );
}


