interface NewsData {
  url: string;
  title: string;
  dateTime: Date;
  source: string;
  content: Array<string>;
}

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpeg",
  "image/webp",
];

const MESSAGES = {
  title: {
    required: "El título es obligatorio",
  },
  source: {
    required: "La fuente es obligatoria (Ej: Los Tiempos, Opinión, etc)",
  },
  date: {
    required: "La fecha es obligatoria",
    max: "La fecha no puede ser mayor a la fecha actual",
  },
  content: {
    required: "El contenido es obligatorio",
  },
  summary: {
    required: "El resumen es obligatorio",
  },
  url: {
    format: "La URL no es válida",
  },
  image: {
    format:
      "El formato de la imagen no es válido, por favor sube una imagen en formato JPG, PNG o WEBP",
    size: "El tamaño de la imagen no puede ser mayor a 2MB",
  },
  tags: {
    max: "El número de etiquetas no puede ser mayor a 5",
  },
};

export type { NewsData };

export { ACCEPTED_IMAGE_TYPES, MESSAGES };