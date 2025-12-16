import { db } from '../config/DatabaseConfig.js';
export const OptionModel = {
    async getUserOptions(userId) {
        const [rows] = await db.query("SELECT * FROM options WHERE userId = ?", [userId]);
        return rows;
    },
    async getUserOption(userId, optionName) {
        const [rows] = await db.query("SELECT * FROM options WHERE userId = ? AND name = ?", [userId, optionName]);
        if (rows.length === 0)
            return null;
        return rows[0];
    },
    async insertOption(option) {
        const [result] = await db.query('INSERT INTO options (userId, name, description, ranking) VALUES (?, ?, ?, ?)', [option.userId, option.name, option.description, option.ranking]);
        return result;
    }
};
