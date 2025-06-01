import { redirect } from "next/navigation";
import Checkout from "./checkout-form";
import { cookies } from "next/headers";
export interface Order {
    id: number;
    createdAt: Date | null;
    updatedAt: Date | null;
    userId: string;
    orderNumber: string;
    orderDate: string;
    status: string;
}

interface Item {
    id: number;
    image: string | null;
    orderId: number;
    itemId: number;
    title: string;
    quantity: number;
    price: number;
}


interface OrderResponse {
    items: Item[];
    order: Order;
}

export default async function Order() {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
        .getAll()
        .map(({ name, value }: { name: string; value: string }) => `${name}=${value}`)
        .join("; ");

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/order`, {
        headers: {
            cookie: cookieHeader,
        },
    });

    // if (!response.ok) {
    //     redirect("/error"); // or handle error differently
    // }

    const { items, order }: OrderResponse = await response.json();

    return (
        <div className="h-screen w-full m-0">
            <div className="flex items-center justify-center h-full w-[80%] mx-auto">
                <div className="w-1/3 flex flex-col gap-4">
                    {items && items.map((item) => (
                        <span key={item.id}>
                            {item.title} {item.quantity}
                        </span>
                    ))}
                </div>
                <div className="w-1/3 p-1 py-4 border rounded-xl">
                    <Checkout order={order} />
                </div>
            </div>
        </div>
    );
}




