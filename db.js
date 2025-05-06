import * as SQLite from 'expo-sqlite';

export const openDatabase = async () => {
    return await SQLite.openDatabaseAsync('mydatabase.db');
};

export const createTable = async () => {
    const db = await openDatabase();
    try {
        await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS users (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName  TEXT    NOT NULL,
        lastName   TEXT    NOT NULL,
        phone      TEXT,
        avatar     TEXT
      );
    `);
        console.log('ready');
    } catch (e) {
        console.error('Error', e);
    }
};

export const insertUser = async ({ firstName, lastName, phone, avatar }) => {
    if (!firstName.trim() || !lastName.trim()) return;
    const db = await openDatabase();
    try {
        const result = await db.runAsync(`INSERT INTO users (firstName, lastName, phone, avatar) VALUES (?, ?, ?, ?)`, [ firstName.trim(), lastName.trim(), phone || '', avatar || '' ]);
        console.log('insrted, result.lastInsertRowid');
        return result.lastInsertRowid;
    } catch (e) {
        console.error('Error in ur', e);
    }
};

export const fetchUsers = async () => {
    const db = await openDatabase();
    try {
        const rows = await db.getAllAsync('SELECT * FROM users');
        console.log('Fetch', rows);
        return rows;
    } catch (e) {
        console.error('Error fetch', e);
    }
};

export const updateUser = async ({ firstName, lastName, phone, avatar }, id) => {
    if (!id || !firstName.trim() || !lastName.trim()) return;
    const db = await openDatabase();
    try {
        await db.runAsync(`UPDATE users SET firstName = ?, lastName = ?, phone = ?, avatar = ? WHERE id = ?`, [ firstName.trim(), lastName.trim(), phone || '', avatar || '', id ]);
        console.log('Updated', id);
    } catch (e) {
        console.error('Error updat:', e);
    }
};

export const deleteUser = async (id) => {
    if (!id) return;
    const db = await openDatabase();
    try {
        await db.runAsync('DELETE FROM users WHERE id = ?', [id]);
        console.log('Deleted', id);
    } catch (e) {
        console.error('Error del:', e);
    }
};
