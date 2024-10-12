import { AutomaticProvider } from "@/store/AssitedRecordNewsProvider";
import layoutProps from "@/types/layaoutType";
import { getCategories } from "@/lib/api/categories";
import { redirect } from "next/navigation";

const LayoutRegistroAsistido = async ({ children }: layoutProps) => {
    try {
        const categories = await getCategories();
        return (
            <div className="flex justify-center">
                <div className="flex flex-col gap-4 w-full max-w-[1024px]">
                    <AutomaticProvider categories={categories}>
                        {children}
                    </AutomaticProvider>
                </div>
            </div>
        );
    } catch (error) {
        console.error(error);
        redirect("/");
    }
};

export default LayoutRegistroAsistido;
