"use client";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";
import { useState } from "react";
import { CartProvider, useCart } from "../../context/cart-context";
import { Product } from "@/app/types/product-type";

export default function HeroSlider({ items }: { items: any }) {
    return (
        <div className="flex items-center justify-center w-full p-3 bg-white ">
            <div className="w-full px-4 mx-auto max-w-7xl">
                <Carousel
                    className="w-full"
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    plugins={[
                        Autoplay({
                            delay: 2000,
                        }),
                    ]}
                >
                    <CarouselContent>
                        {items?.map((item: any) => (
                            <CarouselItem key={item.id} className="basis-1/3">
                                <div className=" h-[400px]">
                                    <ItemsCard item={item} />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
        </div>
    );
}

export function ItemsCard({ item }: { item: Product }) {
    const { cart, setCart } = useCart();
    const addToCart = (product: Product) => {
        setCart((prev) => ({
            ...prev,
            [product.id]: prev[product.id]
                ? [prev[product.id][0] + 1, product]
                : [1, product],
        }));
    };

    return (
        <Card className="relative h-full p-4 overflow-hidden  bg-neutral-50">
            <CardContent className=" flex flex-col items-center justify-center h-full space-y-2 ">
                <Image
                    src={item.images[0]}
                    width={500}
                    height={300}
                    alt={item.title}
                    className="object-cover object-center rounded"
                />
                <span className="text-xl font-semibold text-neutral-800 ">
                    {item.title} <span className="text-yellow-300">${item.price}</span>
                </span>
            </CardContent>
            <div className="absolute top-3 right-3">
                <Description item={item} />
            </div>
            <Button onClick={() => addToCart(item)}>Add to cart</Button>
        </Card>
    );
}

function Description({ item }: { item: Product }) {
    return (
        <Drawer>
            <DrawerTrigger>
                {" "}
                <InfoIcon className="size-8 text-gray-500 hover:text-gray-800 transition-colors ease-in-out cursor-pointer" />
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>{item.title}</DrawerTitle>
                    <DrawerDescription>{item.description}</DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                    <Button>Buy</Button>
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
