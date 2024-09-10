import CardRegistro from "@/components/noticias/CardRegistro";

const registerTypes = [
    {
        icon: "edit_note",
        title: "Registro manual",
        description:
            "Proporciona todos los datos necesarios a través de un formulario completo.",
        href: "/administrar-noticias/registro/manual",
        buttonText: "Iniciar",
        secondHref: "",
        secondButtonText: "",
    },
    {
        icon: "find_in_page",
        title: "Registro asistido",
        description:
            "Extrae datos automáticamente desde una URL y completa los campos restantes manualmente.",
        href: "/administrar-noticias/registro/asistido",
        buttonText: "Iniciar",
        secondHref: "",
        secondButtonText: "",
    },
    {
        icon: "add_link",
        title: "Registro por lote de URLs",
        description:
            "Sube múltiples URLs y procesa los datos de cada una automáticamente.\n",
        href: "/administrar-noticias/registro/lote",
        buttonText: "Iniciar",
        secondHref: "/administrar-noticias/registro/lote-urls",
        secondButtonText: "Ver URLs",
    },
    {
        icon: "manage_history",
        title: "Registro programado",
        description:
            "Configura la extracción diaria de contenido desde una fuente específica.",
        href: "/administrar-noticias/registro/programado",
        buttonText: "Configurar",
        secondHref: "",
        secondButtonText: "",
    },
];

const Registro = () => {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="font-lora text-3xl md:text-4xl font-medium">
                Registrar noticia
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 auto-rows-fr gap-4">
                {registerTypes.map((type, i) => {
                    return (
                        <CardRegistro
                            key={i}
                            icon={type.icon}
                            title={type.title}
                            description={type.description}
                            href={type.href}
                            buttonText={type.buttonText}
                            secondHref={type.secondHref}
                            secondButtonText={type.secondButtonText}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default Registro;
