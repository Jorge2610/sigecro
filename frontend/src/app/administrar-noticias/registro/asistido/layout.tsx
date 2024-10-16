import { NewsDataProvider } from "@/store/NewsDataProvider";
import layoutProps from "@/types/layaoutType";

const AssistedRecordLayout = async ({ children }: layoutProps) => {
    return (
        <div className="flex justify-center">
            <div className="flex flex-col gap-4 w-full max-w-[1024px]">
                <NewsDataProvider>{children}</NewsDataProvider>
            </div>
        </div>
    );
};

export default AssistedRecordLayout;
