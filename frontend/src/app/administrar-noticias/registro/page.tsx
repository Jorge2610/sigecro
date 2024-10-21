import ListCardRegister from "@/components/noticias/ListCardRegister";
import { H1 } from "@/components/ui/headings";

const RegisterPage = () => {
    return (
        <div className="flex flex-col gap-4">
            <H1>Registrar noticia</H1>
            <div className="grid grid-cols-1 md:grid-cols-2 auto-rows-fr gap-4">
                <ListCardRegister />
            </div>
        </div>
    );
};

export default RegisterPage;
