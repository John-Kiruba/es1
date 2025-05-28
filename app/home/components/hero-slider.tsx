"use client";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function HeroSlider({ items }: { items: any }) {
    return (
        <div className="w-full p-3 flex items-center justify-center bg-white">
            <div className="mx-auto w-full max-w-7xl px-4">
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
        <Card className="bg-gray-600 overflow-hidden h-full p-4">
            <CardContent className="flex flex-col items-center justify-center h-full space-y-2">
                <Image
                    src={item.images[0]}
                    width={500}
                    height={300}
                    alt={item.title}
                    className="object-cover object-center rounded"
                />
                <span className="text-xl font-semibold text-neutral-100">
                    {item.title}{" "}
                    <span className="text-yellow-300">${item.price}</span>
                </span>
            </CardContent>
        </Card>

    )
}