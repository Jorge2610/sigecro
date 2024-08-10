class Permission {
    constructor(id, name, description) {
      this.id = id;
      this.name = name;
      this.description = description;
    }
    // Getter
    get area() {
      return this.calcArea();
    }
    // Method
    calcArea() {
      return this.height * this.width;
    }
    *getSides() {
      yield this.height;
      yield this.width;
      yield this.height;
      yield this.width;
    }
  }

exports.getAllPermissions = () => {
    return (
        [
            {
                nro: 1,
                name: "Restringir acceso de un usuario al sistema.",
                description:
                    "Permite desactivar temporalmente la cuenta de un usuario, impidiendo su acceso al sistema.",
                expanded: false,
            },
            {
                nro: 2,
                name: "Restaurar acceso de un usuario al sistema.",
                description:
                    "Permite reactivar la cuenta de un usuario previamente restringido, devolviéndole el acceso al sistema.",
                expanded: false,
            },
            {
                nro: 3,
                name: "Gestionar roles de los usuarios del sistema.",
                description:
                    "Permite asignar, modificar y eliminar roles asignados a los usuarios del sistema.(Asignar, cambiar)",
                expanded: false,
            },
            {
                nro: 4,
                name: "Subir noticias.",
                description:
                    "Permite agregar nuevas noticias al sistema, incluyendo noticias manuales y obtención de noticias de manera automáticas la utilización publicación de contenido.",
                expanded: false,
            },
        ]
    );
};