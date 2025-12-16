import { db } from '../config/DatabaseConfig.js';
export const UserModel = {
    async getAll() {
        const [rows] = await db.query("select * from users");
        return rows;
    },
    async create(user) {
        const [result] = await db.query("insert into users (firstname, lastname, email, password) values (?, ?, ?, ?) ", [
            user.firstName, user.lastName, user.email, user.password
        ]);
        return result;
    },
    async findOneByEmail(email) {
        try {
            const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
            const user = rows[0];
            return user;
        }
        catch (error) {
            return null;
        }
    },
    async findById(userId) {
        try {
            const [rows] = await db.query("SELECT * FROM users WHERE userId = ?", [userId]);
            const user = rows[0];
            return user;
        }
        catch (error) {
            return null;
        }
    }
};
