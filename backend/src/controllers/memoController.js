import { getAllMemos, insertMemo, updateMemo, deleteMemo } from "../models/memoModel.js";

export async function getMemos(req, res) {
    try {
        const memos = await getAllMemos();

        res.json(memos);
    }
    catch (error) {
        console.error("Failed to get memos:", error);

        res.status(500).json ({
            error: "Failed to get memos",
        });
    }
}

export async function createMemo(req, res) {
    const { title, content } = req.body ?? {};

    if (
        typeof title !== "string" ||
        !title.trim() ||
        title.trim().length > 255 ||
        typeof content !== "string" ||
        !content.trim()
    ) {
        return res.status(400).json({
            error: "タイトルは1～255文字で、本文は必須です。",
        });
    }

    try {
        const id = await insertMemo(title.trim(), content);
        return res.status(201).json({ id });
    }
    catch (error) {
        console.error("Failed to create memo:", error);
        return res.status(500).json({ error: "Failed to create memo"});
    }
}

export async function editMemo(req, res) {
    const rawId = req.params.id;
    const id = Number(rawId);

    if (!/^\d+$/.test(rawId) || id < 1 || id > 2147483647) {
        return res.status(400).json({ error: "メモの ID が無効です。" });
    }

    const { title, content } = req.body ?? {};

    if (
        typeof title !== "string" ||
        !title.trim() ||
        title.trim().length > 255 ||
        typeof content !== "string" ||
        !content.trim()
    ) {
        return res.status(400).json({
            error: "タイトルは1〜255文字で、本文は必須です。",
        });
    }

    try {
        const affectedRows = await updateMemo(id, title.trim(), content);

        if (affectedRows === 0) {
            return res.status(404).json({ error: "メモが見つかりません。" });
        }

        return res.status(204).end();
    } catch (error) {
        console.error("Failed to update memo:", error);
        return res.status(500).json({ error: "Failed to update memo" });
    }
}

export async function removeMemo(req, res) {
    const rawId = req.params.id;
    const id = Number(rawId);

    if (!/^\d+$/.test(rawId) || id < 1 || id > 2147483647) {
        return res.status(400).json({ error: "メモの ID が無効です。" });
    }

    try {
        const affectedRows = await deleteMemo(id);

        if (affectedRows === 0) {
            return res.status(404).json({error: "メモが見つかりません。"});
        }

        return res.status(204).end();
    }
    catch (error) {
        console.error("Failed to delete memo:", error);
        return res.status(500).json({ error: "Failed to dalete memo" });
    }
}