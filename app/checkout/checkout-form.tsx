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
import { useRouter } from "next/navigation";
import { Order } from "./page";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Ban, Table, Terminal } from "lucide-react";
import { TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

const FormSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    phoneNumber: z.string().regex(/^\d{10}$/, "Must be 10 digits"),
    cardNumber: z.string().regex(/^\d{16}$/, "Must be 16 digits"),
    expiryDate: z
        .string()
        .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Must be in MM/YY format"),
    cvv: z.string().length(3, "Must be 3 digits"),
    status: z.enum(["approved", "declined", "error"]),
});

type TFormSchema = z.infer<typeof FormSchema>;
type OrderItem = {
    id: number;
    title: string;
    quantity: number;
    price: number;
};

interface updatedOrder {
    id: number;
    createdAt: Date | null;
    updatedAt: Date | null;
    userId: string;
    status: string;
    orderNumber: string;
    orderDate: string;
    items: OrderItem[];
}

export default function Checkout({ order }: { order: Order }) {
    const { data, isLoading, isError } = useQuery<{
        name: string;
        email: string;
        phoneNumber: string;
        cardNumber: string;
        expiryDate: string;
    }>({
        queryKey: ["user-info"],
        queryFn: async () => {
            const res = await fetch("/api/user");
            if (!res.ok) throw new Error("Failed to fetch user info");
            return res.json();
        },
    });

    const form = useForm<TFormSchema>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            email: "",
            phoneNumber: "",
            cardNumber: "",
            expiryDate: "",
            cvv: "",
            status: "approved",
        },
    });

    React.useEffect(() => {
        if (data) {
            form.reset({
                name: data.name ?? "",
                email: data.email ?? "",
                phoneNumber: data.phoneNumber ?? "",
                cardNumber: data.cardNumber ?? "",
                expiryDate: data.expiryDate ?? "",
                cvv: "", // never prefill CVV for security
                status: "approved",
            });
        }
    }, [data, form]);

    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [showDeclineAlert, setShowDeclineAlert] = React.useState(false);
    const [orderDetails, setOrderDetails] = React.useState<updatedOrder | null>(null);
    const [isOrderDialogOpen, setIsOrderDialogOpen] = React.useState(false);
    const onSubmit = async (formData: TFormSchema) => {
        try {
            setIsSubmitting(true);

            if (formData.status === "declined") {
                setShowDeclineAlert(true);
                setTimeout(() => setShowDeclineAlert(false), 4000);
                return;
            }
            if (formData.status === "error") {
                setIsDialogOpen(true);
                return;
            }

            if (formData.status === "approved") {

                console.log("before consfirm fetch", order)
                const response = await fetch("/api/checkout/confirm", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        orderId: order.id,
                        userId: order.userId,
                        ...formData,
                    }),
                });

                console.log(response)
                if (!response.ok) throw new Error("Failed to update payment");

                const data = await response.json();
                console.log("data od order", data)

                toast.success("Payment success. Thank you!.");

                setOrderDetails(data.order);
                console.log("stat order", orderDetails)
                setIsOrderDialogOpen(true);

                setIsSubmitting(false);
            }
        } catch (error) {
            console.log("from here", error)
            toast.error(`${(error as Error).message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div>Loading user info...</div>;
    if (isError) return <div>Error loading user info</div>;

    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="px-10 space-y-4"
                >
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
                                <p className="text-sm font-medium text-gray-700 mb-1">
                                    Mock Payment Outcome
                                </p>
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
                        className="w-full hover:cursor-pointer text-center bg-blue-500 rounded-lg p-3 text-white"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Processing..." : "Pay"}
                    </button>
                </form>
                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Payment gateway error</AlertDialogTitle>
                            <AlertDialogDescription>
                                There was an issue processing your payment. Please try again or
                                contact support.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={() => setIsDialogOpen(false)}>
                                Retry
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-lg">
                    {showDeclineAlert && (
                        <Alert variant="destructive" className="shadow-lg">
                            <Ban className="h-5 w-5 mr-2" />
                            <AlertTitle>Payment Declined</AlertTitle>
                            <AlertDescription>
                                Your transaction was declined. Please try again.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            </Form>

            <AlertDialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
                <AlertDialogContent className="max-w-3xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Order Details</AlertDialogTitle>
                        <AlertDialogDescription>
                            Here are the details of your order:
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    {orderDetails && Array.isArray(orderDetails.items) && (
                        <Table>
                            <TableCaption>Details for order #{orderDetails.id}</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orderDetails.items.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.title}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>${item.price.toFixed(2)}</TableCell>
                                        <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell colSpan={3} className="text-right font-bold">
                                        Grand Total
                                    </TableCell>
                                    <TableCell className="font-bold">
                                        ${orderDetails.items.reduce((acc, i) => acc + i.price * i.quantity, 0).toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    )}

                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setIsOrderDialogOpen(false)}>
                            Close
                        </AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </>
    );
}
