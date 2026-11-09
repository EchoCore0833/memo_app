const MEMOS_URL = "http://localhost:3000/api/memos";

export async function fetchMemos() {
    const response = await fetch(MEMOS_URL);

    if (!response.ok) {
        throw new Error(`メモ一覧の取得に失敗しました (${response.status})`);
    }

    return response.json();
}

export async function createMemo(title, content) {
    const response = await fetch(MEMOS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ title, content}),
    });

    if (!response.ok) {
        throw new Error(`メモの登録に失敗しました (${response.status})`);
    }
}

export async function updateMemo(id, title, content) {
    const response = await fetch(`${MEMOS_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content}),
    });

    if (!response.ok) {
        throw new Error(`メモの更新に失敗しました (${response.status})`);
    }
    
}

export async function deleteMemo(id) {
    const response = await fetch(`${MEMOS_URL}/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error(`メモの削除に失敗しました。(${response.status})`);
    }
}