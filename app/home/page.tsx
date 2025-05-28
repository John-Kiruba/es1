import { ArrowDownNarrowWideIcon, ArrowDownToDot } from "lucide-react";
import HeroSlider, { ItemsCard } from "./components/hero-slider";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export default async function Hero() {
    const res = await fetch(
        `${baseUrl}/api/products`,
        {
            cache: "force-cache",
            next: { revalidate: 1000 }
        },
    );
    const { data } = await res.json();


    return (
        <main className="min-h-screen w-full font-sans">
            <nav className="border-b-2 border-neutral-200 h-16 w-full" >
                <div className="flex items-center justify-between h-full mx-5">
                    <div className="flex gap-4 text-xl ">
                        <button>Logo</button>
                        <h2 className="italic">esalesone</h2>
                    </div>
                    <div className=" flex items-center gap-4 font-semibold ">
                        <button className="border-2 border-neutral-200 p-2 px-3 rounded-lg ">Cart</button>
                        <button className="border-2 border-neutral-200 p-2 px-3 rounded-lg ">Login</button>
                    </div>
                </div>
            </nav>
            <section id="hero" className="bg-">
                <h2 className="my-3 uppercase text-2xl text-gray-600 text-center">Order Now during Sale  and save a fortune</h2>
                <HeroSlider items={data.products} />

            </section>

            <section id="products-intro" className="mt-7 ">
                <div className="text-center">
                    <h2 className="text-5xl ">Popular products in your location</h2>
                    <h3 className="text-xl p-3">fresh & clean; grown, cultivated, manufactured inland to support local economy</h3>
                    <ArrowDownToDot className="inline-flex justify-center text-5xl animate-bounce mt-5" />
                </div >
            </section>

            <section id="products">
                <div className="grid grid-cols-3 xl:grid-cols-5 justify-items-center mx-auto max-w-[80%] my-10 p-3 gap-2.5">
                    {data.products.map((item: any) => {
                        return (
                            <div key={item.id} className="">
                                <ItemsCard item={item} />
                            </div>)
                    })}
                </div>
            </section>
        </main>
    );
}
