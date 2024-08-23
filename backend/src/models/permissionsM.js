import { query } from "../config/db.js";

class Permission {
    /**
     * Recupera la lista de permisos desde la base de datos.
     *
     * @return {object[]} Un arreglo de JSON que representan las categorias.
     */
    static async getPermissions() {
        const res = await query(
            "SELECT id, name, description FROM public.permissions;",
            []
        );
        return res.rows;
    }
}

export { Permission };
