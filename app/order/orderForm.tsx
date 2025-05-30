'use client'
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
import { useForm, } from "react-hook-form";
import z from "zod";

export default function FormDetails() {
    const FormSchema = z.object({
        name: z.string().min(3),
        email: z.string().email(),
        phoneNumber: z.string().regex(/^\d{10}$/, "Must be 10 digits"),
        cardNumber: z.string().regex(/^\d{16}$/, "Must be 16 digits"),
        expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Must be in MM/YY format"),
        cvv: z.string().length(3, 'Must be 3 digits'),
    });

    type TFormSchema = z.infer<typeof FormSchema>;

    const form = useForm<TFormSchema>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: '',
            email: '',
            phoneNumber: '',
            cardNumber: '',
            expiryDate: '',
            cvv: ''
        }
    });


    const onSubmit = (data: TFormSchema) => {
        console.log(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className=" px-10 space-y-4">
                <h2 className="text-xl font-sans font-semibold text-center">
                    Enter Details
                </h2>

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Enter Name</FormLabel>
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
                            <FormLabel>Enter Email</FormLabel>
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
                            <FormLabel>Enter Phone Number</FormLabel>
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
                            <FormLabel>Enter Card Number</FormLabel>
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
                            <FormLabel>Enter Expiry Date</FormLabel>
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
                            <FormLabel>Enter CVV</FormLabel>
                            <FormControl>
                                <Input placeholder="CVV" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <button
                    className="w-full hover:cursor-pointer text-center bg-blue-500 rounded-lg p-3 text-white "
                    type="submit"
                >
                    Submit
                </button>
            </form>
        </Form>
    );
}

