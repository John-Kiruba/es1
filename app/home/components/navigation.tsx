"use client";
import { redirect, useRouter } from "next/navigation";
import { useCart } from "../../context/cart-context";
import { Button } from "@/components/ui/button";
import es1 from "@/public/es1.png";
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
import { authClient } from "@/app/lib/auth-client";
import { ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import { signOut } from "@/app/api/auth/signout/signout";

export default function Navbar() {
    const { data: session } = authClient.useSession();
    const { cart } = useCart();
    const lenCart = Object.keys(cart).length;
    return (
        <nav className="sticky top-0 left-0 z-10 shadow-md bg-white border-b-2 border-neutral-200 h-16 w-full">
            <div className="flex items-center justify-between h-full mx-5">
                <div className="flex gap1 text-xl ">
                    <button>
                        <Image
                            src={es1}
                            alt="esalesone logo"
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                        />
                    </button>
                    <h2 className="italic">esalesone</h2>
                </div>
                <div className="flex items-center gap-4 font-semibold">
                    <CartButtonProvider>
                        <button className="cursor-pointer  relative border-2 border-neutral-200 p-2 px-3 rounded-lg ">
                            <ShoppingCart />
                            {lenCart > 0 && (
                                <span className="text-lg absolute top-0 right-0 size-3 bg-red-500 rounded-full animate-bounce"></span>
                            )}
                        </button>
                    </CartButtonProvider>
                    {session?.user ? (
                        <PopOverProvider>
                            <Button
                                variant="outline"
                                className="cursor-pointer border-2 border-neutral-200 size-12 rounded-full overflow-hidden p-0"
                            >
                                <Image
                                    src={session.user.image || es1}
                                    alt="Profile"
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                />
                            </Button>
                        </PopOverProvider>


                    ) : (

                        <Button variant="outline"
                            onClick={() => { redirect("/signin") }}
                            className="cursor-pointer border-2 border-neutral-200 p-2 px-3 rounded-lg ">
                            Login
                        </Button>

                    )}
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
                [id]: [count + 1, product],
            };
        });
    };

    const decreaseCount = (id: number) => {
        setCart((prev) => {
            const currentItem = prev[id];
            if (!currentItem) return prev;

            const [count, product] = currentItem;

            if (count <= 1) {

                const { [id]: _, ...rest } = prev;
                return rest;
            }

            return {
                ...prev,
                [id]: [count - 1, product],
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

    const orderBuy = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/order`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(cart),
        });
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
                    <Button onClick={orderBuy} type="submit">
                        Buy
                    </Button>
                    <SheetClose asChild>
                        <Button variant="outline">Close</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}



function PopOverProvider({ children }: { children: React.ReactNode }) {
    return (
        <Popover >
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent className="bg-white p-3 rounded-2xl border border-neutral-200 shadow-sm w-52 mt-1 mr-2 ">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="leading-none font-medium">Hey!</h4>
                        <p className="text-muted-foreground text-sm">
                            @esalesone
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <div className="grid items-center gap-4">
                            <Button
                                onClick={signOut}
                                variant="destructive" className="p-2 w-full cursor-pointer">Sign Out</Button>
                        </div>

                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}