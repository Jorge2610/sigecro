import { ManualNewsProvider } from "@/components/noticias/manual/ManualNewsProvider";
const LayoutManualRegisterNews = async ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <div className="flex justify-center">
            <div className="flex flex-col gap-4 w-full max-w-[1024px]">
                <p className="font-semibold text-sig-blue">Formulario</p>
                <ManualNewsProvider>{children}</ManualNewsProvider>
            </div>
        </div>
    );
};

export default LayoutManualRegisterNews;
