import { AssistedRecordProvider } from "@/store/AssitedRecordProvider";
import layoutProps from "@/types/layaoutType";
import { getCategories } from "@/lib/api/categories";
import { ServerErrorPage } from "@/components/ui/error-page";

const AssistedRecordLayout = async ({ children }: layoutProps) => {
    try {
        const categories = await getCategories();
        return (
            <div className="flex justify-center">
                <div className="flex flex-col gap-4 w-full max-w-[1024px]">
                    <AssistedRecordProvider categories={categories}>
                        {children}
                    </AssistedRecordProvider>
                </div>
            </div>
        );
    } catch (error) {
        return <ServerErrorPage />;
    }
};

export default AssistedRecordLayout;
