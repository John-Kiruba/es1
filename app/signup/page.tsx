"use client";

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { signUp } from "../api/auth/signup/signup";
import { Separator } from "@/components/ui/separator";
import { authClient } from "../lib/auth-client";
import { redirect } from "next/navigation";

export default function SignUp() {
    const { data: session } = authClient.useSession();
    if (session) redirect("/home");

    const FormSchema = z
        .object({
            name: z.string().min(3),
            email: z.string().email(),
            password: z.string(),
            confirmPassword: z.string(),
        })
        .refine((val) => val.confirmPassword === val.password, {
            message: "passwords dont match",
            path: ["confirmPassword"],
        });

    type TFormSchema = z.infer<typeof FormSchema>;

    const form = useForm<TFormSchema>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async () => {
        const { email, name, password } = form.getValues();
        await signUp({ email, name, password });
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
                            Quick, create an account !
                        </h2>

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Name" {...field} />
                                    </FormControl>
                                    {/* <FormDescription>Enter {fieldName}</FormDescription> */}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Confirm Password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <button
                            className="w-full hover:cursor-pointer text-center bg-blue-500 rounded-lg p-3 text-white "
                            type="submit"
                        >
                            Signup
                        </button>
                    </form>
                </Form>
            </div>
        </div>
    );
}
