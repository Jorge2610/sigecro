import { NewsDataProvider } from "@/store/NewsDataProvider";
const LayoutManualRegisterNews = async ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <div className="flex justify-center">
            <div className="flex flex-col gap-4 w-full max-w-[1024px]">
                <NewsDataProvider>{children}</NewsDataProvider>
            </div>
        </div>
    );
};

export default LayoutManualRegisterNews;
