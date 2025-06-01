
import { redirect } from "next/navigation";
import Checkout from "./checkout-form"
import { cookies } from "next/headers";
export default async function Order() {
    const cookieHeader = cookies().toString();
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/order`, {
        headers: {
            cookie: cookieHeader,
        },
    });
    const { items } = await response.json();
    console.log(items);
    return (
        <>
            <div className="h-screen w-full m-0">
                <div className="flex items-center justify-center h-full w-[80%] mx-auto">
                    <div className="w-1/3 flex flex-col gap-4">
                        {items.map((item: { id: string; title: string; quantity: number }) => {
                            return <span key={item.id}> {item.title} {item.quantity}</span>
                        })}
                    </div>
                    <div className="w-1/3 p-1 py-4 border rounded-xl">
                        <Checkout />
                    </div>
                </div>

            </div>
        </>
    )
}




