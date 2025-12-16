import { db } from '../config/DatabaseConfig.js';
;
export const MonumentModel = {
    async getAll() {
        const [rows] = await db.query("select * from buildings");
        return rows;
    },
    async findOneByName(name) {
        try {
            const [rows] = await db.query("SELECT * FROM users WHERE name = ?", [name]);
            const monument = rows[0];
            return monument;
        }
        catch (error) {
            return null;
        }
    }
};
