INSERT INTO
    public.permissions(name, description)
VALUES
    (
        'Restringir acceso de un usuario al sistema.',
        'Restringir acceso de un usuario al sistema.'
    ),
    (
        'Restaurar acceso de un usuario al sistema.',
        'Permite reactivar la cuenta de un usuario previamente restringido, devolviéndole el acceso al sistema.'
    ),
    (
        'Crear roles.',
        'Permite definir y crear nuevos roles con su título, descripción y permisos específicos en el sistema.'
    ),
    (
        'Eliminar roles.',
        'Permite eliminar roles existentes del sistema, asegurándose de que ningún usuario esté asignado a ellos antes de su eliminación.'
    ),
    (
        'Editar roles.',
        'Permite modificar los permisos, titulo y descripción de los roles existentes en el sistema.'
    ),
    (
        'Subir noticias.',
        'Permite agregar nuevas noticias al sistema, incluyendo noticias manuales y obtención de noticias de manera automáticas la utilización publicación de contenido.'
    ),
    (
        'Editar noticias.',
        'Permite modificar el contenido (resumen, etiquetas, titulo y categoría) de noticias ya publicadas en el sistema.'
    ),
    (
        'Eliminar noticias.',
        'Permite remover noticias del sistema, eliminándolas permanentemente.'
    ),
    (
        'Visualizar noticias.',
        'Permite a los usuarios ver noticias publicadas en el sistema.'
    ),
    (
        'Crear categoría.',
        'Permite crear nuevas categorías para clasificar noticias.'
    ),
    (
        'Editar categoría.',
        'Permite modificar los nombres y descripciones de las categorías existentes.'
    ),
    (
        'Eliminar categoría.',
        'Permite eliminar categorías del sistema, asegurándose de que no estén en uso antes de su eliminación.'
    ),
    (
        'Búsqueda avanzada.',
        'Permite a los usuarios realizar búsquedas detalladas y filtradas en el sistema. Puede ser una función opcional.'
    ),
    (
        'Administrar cronologías propias.',
        'Permite a los usuarios administrar las cronologías que tenga creadas en el sistema.'
    ),
    (
        'Administrar cronologías del sistema.',
        'Permite editar y eliminar todas las cronologías en el sistema, independientemente de quién las haya creado.'
    ),
    (
        'Subir análisis de una cronología.',
        'Permite agregar un análisis a una cronología existente en el sistema.'
    ),
    (
        'Descargar cronologías propias.',
        'Permite a los usuarios descargar cronologías que han creado en el sistema.'
    ),
    (
        'Descargar cronologías publicadas.',
        'Permite descargar cronologías que han sido publicadas y están disponibles para todos los usuarios.'
    ),
    (
        'Descargar análisis.',
        'Permite descargar análisis de cronologías publicadas.'
    ),
    (
        'Descargar base de datos propias.',
        'Permite a los usuarios descargar bases de datos de noticias relacionadas con las cronologías propias.'
    ),
    (
        'Descargar base de datos publicas',
        'Permite descargar bases de datos relacionadas con cronologías publicadas disponibles para todos'
    ),
    (
        'Descargar referencias propias',
        'Permite a los usuarios descargar referencias bibliográficas y otras citas asociadas a las cronologías propias.'
    ),
    (
        'Descargar referencias publicas',
        'Permite descargar referencias de cronologías publicadas.'
    ),
    (
        'Revisar contenido para publicación.',
        'cronologías, noticias??, análisis (aprobar, rechazar)'
    ),
    (
        'Ver reporte de actividad en el sistema.',
        'Permite ver informes detallados sobre la actividad de los usuarios y el uso del sistema.'
    ),
    (
        'Eliminar usuarios del sistema',
        'Permite remover permanentemente cuentas de usuario del sistema.'
    ),
    (
        'Gestionar roles de los usuarios del sistema',
        'Permite asignar, modificar y eliminar roles asignados a los usuarios del sistema.(Asignar, cambiar)'
    );