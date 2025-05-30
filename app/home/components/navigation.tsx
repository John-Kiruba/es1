"use client";

import { useCart } from "../../context/cart-context";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import Image from "next/image";
export default function Navbar() {
    const { cart } = useCart();
    const lenCart = Object.keys(cart).length;
    return (
        <nav className="border-b-2 border-neutral-200 h-16 w-full">
            <div className="flex items-center justify-between h-full mx-5">
                <div className="flex gap-4 text-xl ">
                    <button>Logo</button>
                    <h2 className="italic">esalesone</h2>
                </div>
                <div className=" flex items-center gap-4 font-semibold ">
                    <CartButtonProvider>
                        <button

                            className="cursor-pointer  relative border-2 border-neutral-200 p-2 px-3 rounded-lg ">
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


export function CartButtonProvider({ children }: { children: React.ReactNode }) {
    const { cart, setCart } = useCart()
    return (
        <Sheet>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className="text-2xl" >Your Cart</SheetTitle>
                    <SheetDescription>
                        Finalize your order items & proceed to payments
                    </SheetDescription>
                </SheetHeader>
                <div>
                    {Object.entries(cart).map((item) => {
                        const product = item[1][1]
                        return (
                            <div key={item[0]} className="flex flex-col mx-5 w-full ">
                                <div className="flex items-center justify-start gap-3">
                                    <Image
                                        src={product.images[0]}
                                        width={70}
                                        height={70}
                                        alt={product.title}
                                        className="object-cover object-center rounded"
                                    />
                                    <span className="">{product.title}</span>
                                    <span>{item[0]}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <SheetFooter>
                    <Button type="submit">Save changes</Button>
                    <SheetClose asChild>
                        <Button variant="outline">Close</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

