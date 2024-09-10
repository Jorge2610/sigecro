import { AutomaticProvider } from "@/components/noticias/automatico/AutomaticProvider";
import axios from "axios";

const LayoutRegistroAsistido = async ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const CATEGORIES = await axios
        .get(`${process.env.API_HOST}/categories`)
        .then((res) => {
            if (res.status === 200) {
                return res.data.rows;
            }
        });
    return (
        <div className="flex justify-center">
            <div className="flex flex-col gap-4 w-full max-w-[1024px]">
                <p className="font-semibold text-sig-blue">Formulario</p>
                <AutomaticProvider categories={CATEGORIES}>
                    {children}
                </AutomaticProvider>
            </div>
        </div>
    );
};

export default LayoutRegistroAsistido;
