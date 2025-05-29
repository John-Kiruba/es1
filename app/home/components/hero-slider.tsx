"use client";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export default function HeroSlider({ items }: { items: any }) {
    return (
        <div className="flex items-center justify-center w-full p-3 bg-white">
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

export function ItemsCard({ item }: { item: any }) {
    return (
        <Card className="h-full p-4 overflow-hidden bg-gray-600">
            <CardContent className="flex flex-col items-center justify-center h-full space-y-2 ">
                <Image
                    src={item.images[0]}
                    width={500}
                    height={300}
                    alt={item.title}
                    className="object-cover object-center rounded"
                />
                <span className="text-xl font-semibold text-neutral-100">
                    {item.title} <span className="text-yellow-300">${item.price}</span>
                </span>
                <Description item={item} />
            </CardContent>

        </Card>
    );
}


function Description({ item }: { item: any }) {
    return (
        <>
            <Drawer>
                <DrawerTrigger>Buy Now</DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>{item.title}</DrawerTitle>
                        <DrawerDescription>{item.description}</DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                        <Button>Buy</Button>
                        <DrawerClose>
                            <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
                {/* <div className="flex flex-col justify-between border-t border-neutral-200 bg-gray-800/70">
                    <p className="text-neutral-200"></p>

                    <button className="p-2 text-white border">Buy now </button>
                </div> */}
            </Drawer>
        </>
    )
}