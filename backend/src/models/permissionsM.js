import { query } from "../config/db.js";

class Permission {
    /**
     * Retrieves the list of permissions from the database.
     *
     * @return {object[]} An array of JSON objects representing the permissions.
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
