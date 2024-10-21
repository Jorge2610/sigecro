import NewsHelper from "@/components/noticias/NewsHelper";
import BatchRecord from "@/components/noticias/batch-record/batchRecord";
import { getCategories } from "@/lib/api/categories";

const helps = [
    "Selecciona una categoría la cual será común para todas las URLs.",
    "Ingresa una lista de URLs, una por línea.",
    'Haz clic en "Procesar lote". El sistema procesará cada URL de manera secuencial.',
    'Monitorea el progreso en la sección "URLs pendientes".',
];

const BatchPage = async () => {
    const categories = await getCategories();
    return (
        <div className="flex justify-center">
            <div className="flex flex-col w-full max-w-[1024px]">
                <NewsHelper title="Registro por lote de URLs" helps={helps} />
                <BatchRecord categories={categories} />
            </div>
        </div>
    );
};

export default BatchPage;
