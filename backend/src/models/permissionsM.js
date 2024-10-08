import { query } from "../config/db.js";

class Permission {
    /**
     * Retrieves a list of all permissions.
     *
     * @returns {Promise<QueryResult>} A Promise that resolves to a QueryResult object containing the list of permissions.
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
