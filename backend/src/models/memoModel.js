import pool from "../db.js";

export async function getAllMemos() {
    const [rows] = await pool.query (
        "select id, title, content, false as isDeleted, created_at as createdAt, updated_at as updatedAt from memos where deleted_at is null order by updated_at desc"
    );

    return rows;
}

export async function getMemoById(id) {
    const [rows] = await pool.execute(
        `select id, title, content, false as isDeleted, created_at as createdAt, updated_at as updatedAt from memos where id = ? and deleted_at is null`,
        [id]
    );

    return rows[0] ?? null;
}

export async function insertMemo(title, content) {
    const [result] = await pool.execute(
        "insert into memos (title, content) values (?, ?)",
        [title, content]
    );

    return result.insertId;
}

export async function updateMemo(id, title, content) {
    const [result] = await pool.execute(
        `update memos
         set title = ?, content = ?
         where id = ? and deleted_at is null`,
        [title, content, id]
    );

    return result.affectedRows;
}

export async function deleteMemo(id) {
    const [result] = await pool.execute(
        `update memos
         set deleted_at = current_timestamp
         where id = ? and deleted_at is null`,
         [id]
    );

    return result.affectedRows;
}