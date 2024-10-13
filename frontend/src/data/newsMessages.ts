const toastMessages = {
    errorTitle: "Error al guardar datos",
    errorDesc:
        "Ocurrió un problema en el servidor. Por favor, intenta nuevamente más tarde.",
    successTitle: "Datos guardados exitosamente",
    successDesc:
        "Los datos fueron enviados y guardados correctamente en el servidor.",
};

const title = {
    required: "El título es obligatorio",
    label: "Título *",
    placeholder: "Escriba el título de la noticia... ",
};

const popupCancel = {
    title: "Cancelar registro",
    description: "Todos los cambios no guardados se perderán.",
};
const popupPublic = {
    title: "Publicar noticia",
    description:
        "¿Deseas enviar la noticia para revisión antes de su publicación?",
};

export { toastMessages, title, popupCancel, popupPublic };
