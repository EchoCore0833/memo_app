import { getAllMemos, getMemoById, insertMemo, updateMemo, deleteMemo } from "../models/memoModel.js";
import { broadcastMemoChange } from "../websocket/memoSocket.js";

function createDefaultTitle() {
    const date = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Tokyo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(new Date());

    return `メモ(${date})`;
}

function normalizeMemoInput(body) {
    const title = body?.title ?? "";
    const content = body?.content ?? "";

    if (typeof title !== "string" || typeof content !== "string") {
        return {
            error: "タイトルと本文は文字列で入力してください。",
        };
    }

    const normalizedTitle = title.trim() || createDefaultTitle();

    if (normalizedTitle.length > 100) {
        return {
            error: "タイトルは100文字以内で入力してください。",
        };
    }

    if (content.length > 10000) {
        return {
            error: "本文は10,000文字以内で入力してください。",
        };
    }

    return {
        title: normalizedTitle,
        content,
    };
}

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

export async function getMemo(req, res) {
    const rawId = req.params.id;
    const id = Number(rawId);

    if (!/^\d+$/.test(rawId) || id < 1 || id > 2147483647) {
        return res.status(400).json({
            error: "メモの ID が無効です。",
        });
    }

    try {
        const memo = await getMemoById(id);

        if (memo === null) {
            return res.status(404).json({
                error: "メモが見つかりません。",
            });
        }

        return res.status(200).json(memo);
    }
    catch (error) {
        console.error("Failed to get memo:", error);

        return res.status(500).json({
            error: "Failed to get memo",
        });
    }
}

export async function createMemo(req, res) {
    const input = normalizeMemoInput(req.body);

    if (input.error) {
        return res.status(400).json({
            error: input.error,
        });
    }

    try {
        const id = await insertMemo(input.title, input.content);
        const memo = await getMemoById(id);

        broadcastMemoChange({
            type: "memo:created",
            memoId: id
        });

        return res.status(201).json(memo);
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

    const input = normalizeMemoInput(req.body);

    if (input.error) {
        return res.status(400).json({
            error: input.error,
        });
    }

    try {
        const affectedRows = await updateMemo(id, input.title, input.content);

        if (affectedRows === 0) {
            return res.status(404).json({ error: "メモが見つかりません。" });
        }

        const memo = await getMemoById(id);

        broadcastMemoChange({
            type: "memo:updated",
            memoId: id
        });
        return res.status(200).json(memo);
    }
    catch (error) {
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

        broadcastMemoChange({
            type: "memo:deleted",
            memoId: id
        });

        return res.status(204).end();
    }
    catch (error) {
        console.error("Failed to delete memo:", error);
        return res.status(500).json({ error: "Failed to delete memo" });
    }
}