
import FormDetails from "./orderForm"


export default function Order() {
    return (
        <>
            <div className="h-screen w-full m-0">
                <div className="flex items-center justify-center h-full w-[80%] mx-auto">
                    <div className="w-1/3">
                        items
                    </div>
                    <div className="w-1/2 p-4 border rounded-xl">
                        <FormDetails />
                    </div>
                </div>

            </div>
        </>
    )
}




