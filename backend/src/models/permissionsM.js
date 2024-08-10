import { query } from "../config/db.js";

class Permission {
  constructor(id, name, description) {
    this.id = id;
    this.name = name;
    this.description = description;
  }

  static async getPermissions() {
    const res = await query("SELECT id, name, description FROM public.permissions;", []);
    return res.rows;
  }
}

export { Permission };
