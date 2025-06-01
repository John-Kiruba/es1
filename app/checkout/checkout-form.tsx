"use client";

import React from "react";
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
import { useQuery } from "@tanstack/react-query";
import z from "zod";
import { redirect, useRouter } from "next/navigation";

const FormSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    phoneNumber: z.string().regex(/^\d{10}$/, "Must be 10 digits"),
    cardNumber: z.string().regex(/^\d{16}$/, "Must be 16 digits"),
    expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Must be in MM/YY format"),
    cvv: z.string().length(3, "Must be 3 digits"),
    status: z.enum(["approved", "declined", "error"]),
});

type TFormSchema = z.infer<typeof FormSchema>;

export default function Checkout() {
    const { data, isLoading, isError } = useQuery<{
        name: string;
        email: string;
        phoneNumber: string;
        cardNumber: string;
        expiryDate: string;
    }>({
        queryKey: ['user-info'],
        queryFn: async () => {
            const res = await fetch('/api/user');
            if (!res.ok) throw new Error("Failed to fetch user info");
            return res.json();
        }
    });

    const form = useForm<TFormSchema>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            email: "",
            phoneNumber: "",
            cardNumber: "",
            expiryDate: "",
            cvv: "", status: "approved",
        },
    });

    React.useEffect(() => {
        if (data) {
            form.reset({
                name: data.name ?? '',
                email: data.email ?? '',
                phoneNumber: data.phoneNumber ?? '',
                cardNumber: data.cardNumber ?? '',
                expiryDate: data.expiryDate ?? '',
                cvv: '', // never prefill CVV for security,
                status: "approved",
            });
        }
    }, [data, form]);

    const router = useRouter();

    const onSubmit = async (data: TFormSchema) => {
        try {
            console.log("Submitted:", data);

            if (data.status === "declined") {
                alert("❌ Payment Declined");
                return;
            }

            if (data.status === "error") {
                throw new Error("⚠️ Gateway Error Simulated");
            }

            // Approved path — mock DB call
            await new Promise((res) => setTimeout(res, 1000));
            alert("✅ Payment Approved and saved successfully!");

            // You can reset the form or clear card fields
            form.reset({ ...data, cvv: "", cardNumber: "" });

        } catch (err) {
            alert((err as Error).message || "Unexpected error");
        }
    };

    if (isLoading) return <div>Loading user info...</div>;
    if (isError) return <div>Error loading user info</div>;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="px-10 space-y-4">
                <h2 className="text-xl font-sans font-semibold text-center">
                    Payment Details
                </h2>

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="Name" {...field} />
                            </FormControl>
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
                    name="phoneNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="Phone Number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* rest of your fields unchanged */}

                <FormField
                    control={form.control}
                    name="cardNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="Card Number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="Expiry Date" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="cvv"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="CVV" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <p className="text-sm font-medium text-gray-700 mb-1">Mock Payment Outcome</p>
                            <div className="space-y-1">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        value="approved"
                                        checked={field.value === "approved"}
                                        onChange={field.onChange}
                                    />
                                    <span>Approved Transaction</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        value="declined"
                                        checked={field.value === "declined"}
                                        onChange={field.onChange}
                                    />
                                    <span>Declined Transaction</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        value="error"
                                        checked={field.value === "error"}
                                        onChange={field.onChange}
                                    />
                                    <span>Gateway Error / Failure</span>
                                </label>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <button

                    className="w-full hover:cursor-pointer text-center bg-blue-500 rounded-lg p-3 text-white "
                    type="submit"
                >
                    Pay
                </button>

            </form>
        </Form>
    );
}
