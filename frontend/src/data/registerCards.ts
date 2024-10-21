const registerCardData = [
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
        secondHref: "/administrar-noticias/registro/URLs-pendientes",
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

export default registerCardData;
