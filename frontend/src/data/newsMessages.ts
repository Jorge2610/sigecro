const toastMessages = {
    errorTitle: "Error",
    errorDesc:
        "Ocurrió un problema en el servidor. Por favor, intenta nuevamente más tarde.",
    successTitle: "Exito",
    successDesc:
        "Los datos fueron enviados y guardados correctamente en el servidor.",
};

const title = {
    required: "El título es obligatorio",
    label: "Título *",
    placeholder: "Escriba el título de la noticia... ",
};

const source = {
    required: "La fuente es obligatoria (Ej: Los Tiempos, Opinión, etc)",
    label: "Fuente *",
    placeholder: "Escriba la fuente de la noticia...",
};

const date = {
    required: "La fecha es obligatoria",
    max: "La fecha no puede ser mayor a la fecha actual",
    label: "Fecha *",
    placeholder: "Seleccione una fecha",
};

const content = {
    required: "El contenido es obligatorio",
    label: "Contenido *",
    placeholder: "Escriba el contenido de la noticia...",
};

const summary = {
    required: "El resumen es obligatorio",
    label: "Resumen*",
    placeholder: "Escriba el resumen de la noticia...",
    max: "El resumen no pude tener mas de 768 caracteres",
};

const url = {
    format: "La URL no es válida",
    label: "URL",
    placeholder: "Escriba la URL de la noticia...",
};

const popupCancel = {
    title: "Cancelar registro",
    description: "Todos los cambios no guardados se perderán.",
};

const image = {
    format: "El formato del archivo no es válido por favor sube una imagen en formato JPG, PNG o WEBP",
    size: "El tamaño de la imagen no puede ser mayor a 2MB",
    label: "Imagen",
};

const tag = {
    max: "El número de etiquetas no puede ser mayor a 5",
    placeholder: "Escriba las etiquetas de la noticia...",
    unique: "Las etiquetas deben ser únicas",
    label: "Etiquetas",
};

const category = {
    label: "Categoría",
    placeholder: "Escriba la categoría de la noticia...",
};

const popupPublic = {
    title: "Publicar noticia",
    description:
        "¿Deseas enviar la noticia para revisión antes de su publicación?",
};

const batchRegister ={
        error: "EL lote de URLs ingresado no es válido."
}
export {
    toastMessages,
    title,
    source,
    date,
    content,
    summary,
    url,
    image,
    tag,
    category,
    popupCancel,
    popupPublic,
    batchRegister
};
