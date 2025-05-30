"use client";

import { useCart } from "../../context/cart-context";
import { Button } from "@/components/ui/button";
import es1 from "@/public/es1logo.jpg";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
export default function Navbar() {
    const { cart } = useCart();
    const lenCart = Object.keys(cart).length;
    return (
        <nav className="border-b-2 border-neutral-200 h-16 w-full">
            <div className="flex items-center justify-between h-full mx-5">
                <div className="flex gap-4 text-xl ">
                    <button>
                        <Image src={es1} alt="esalesone logo" width={40} height={40} className="rounded-full object-cover" />
                    </button>
                    <h2 className="italic">esalesone</h2>
                </div>
                <div className="flex items-center gap-4 font-semibold">
                    <CartButtonProvider>
                        <button className="cursor-pointer  relative border-2 border-neutral-200 p-2 px-3 rounded-lg ">
                            Cart
                            {lenCart > 0 && (
                                <span className="text-lg absolute top-0 right-0 size-3 bg-red-500 rounded-full animate-bounce"></span>
                            )}
                        </button>
                    </CartButtonProvider>
                    <button className="cursor-pointer border-2 border-neutral-200 p-2 px-3 rounded-lg ">
                        Login
                    </button>
                </div>
            </div>
        </nav>
    );
}

export function CartButtonProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const { cart, setCart } = useCart();

    const increaseCount = (id: number) => {
        setCart((prev) => {
            const currentItem = prev[id];
            if (!currentItem) return prev;

            const [count, product] = currentItem;
            return {
                ...prev,
                [id]: [count + 1, product], // ✅ Correct key and structure
            };
        });
    };

    const decreaseCount = (id: number) => {
        setCart((prev) => {
            const currentItem = prev[id];
            if (!currentItem) return prev;

            const [count, product] = currentItem;

            if (count <= 1) {
                // ✅ Remove item from cart when count is 1 or less
                const { [id]: _, ...rest } = prev;
                return rest;
            }

            return {
                ...prev,
                [id]: [count - 1, product], // ✅ Decrease count
            };
        });
    };

    const total = () => {
        const total = Object.values(cart).reduce(
            (acc, [count, product]) => acc + count * product.price,
            0
        );
        return total.toFixed(2);
    };

    return (
        <Sheet>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className="">
                <SheetHeader>
                    <SheetTitle className="text-2xl">Your Cart</SheetTitle>
                    <SheetDescription>
                        Finalize your order items & proceed to payments
                    </SheetDescription>
                </SheetHeader>
                <div className="overflow-y-auto max-h-4/5">
                    {Object.entries(cart).map(([idStr, [count, product]]) => {
                        const id = Number(idStr); // ensures `id` is a number

                        return (
                            <div
                                key={id}
                                className="flex items-center justify-between gap-1 mx-4"
                            >
                                <div className="flex items-center gap-2">
                                    <Image
                                        src={product.images[0]}
                                        width={70}
                                        height={70}
                                        alt={product.title}
                                        className="object-cover object-center rounded"
                                    />
                                    <span>{product.title}</span>
                                </div>

                                <div className="flex items-center gap-1">
                                    <button
                                        className="cursor-pointer px-2 py-1 border rounded"
                                        onClick={() => decreaseCount(product.id)}
                                    >
                                        −
                                    </button>
                                    <span className="w-6 text-center">{count}</span>
                                    <button
                                        className="cursor-pointer px-2 py-1 border rounded"
                                        onClick={() => increaseCount(product.id)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                    <p className="text-right font-semibold text-lg mx-4">
                        Total: ${total()}
                    </p>
                </div>
                <SheetFooter>
                    <Button type="submit">Save changes</Button>
                    <SheetClose asChild>
                        <Button variant="outline">Close</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
