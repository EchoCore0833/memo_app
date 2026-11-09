import { fetchMemos, createMemo, updateMemo, deleteMemo } from "./api.js";

const status = document.querySelector("#memo-status");
const list = document.querySelector("#memo-list");

let editMemoId = null;

async function showMemos() {
    try {
        const memos = await fetchMemos();
        list.replaceChildren();

        for (const memo of memos) {
            const item = document.createElement("li");
            const title = document.createElement("strong");
            const content = document.createElement("p"); 

            title.textContent = memo.title;
            content.textContent = memo.content;
            
            const editButton = document.createElement("button");
            editButton.type = "button";
            editButton.textContent = "編集";

            editButton.addEventListener("click", () => {
                if (submitButton.disabled) return;
                editMemoId = memo.id;
                form.elements.namedItem("title").value = memo.title;
                form.elements.namedItem("content").value = memo.content;
                submitButton.textContent = "更新";
                formStatus.textContent = "";
                form.elements.namedItem("title").focus();
            });
            
            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.textContent = "削除";

            deleteButton.addEventListener("click", async () => {
                if (submitButton.disabled || !window.confirm("このメモを削除しますか？")) {
                    return;
                }

                deleteButton.disabled = true;
                submitButton.disabled = true;

                try {
                    await deleteMemo(memo.id);

                    if (editMemoId === memo.id) {
                        editMemoId = null;
                        form.reset();
                        submitButton.textContent = "登録";
                        formStatus.textContent = "";
                    }

                    await showMemos();
                }
                catch (error) {
                    console.error(error);
                    status.textContent = "メモを削除できませんでした。";
                }
                finally {
                    deleteButton.disabled = false;
                    submitButton.disabled = false;
                }
            });
            item.append(title, content, editButton, deleteButton);

            list.append(item);
        }

        status.textContent = memos.length === 0 ? "メモはまだありません。" : "";
    }
    catch (error) {
        console.error(error);
        status.textContent = "メモ一覧を読み込めませんでした。";
    }
}

showMemos();

const form = document.querySelector("#memo-form");
const formStatus = document.querySelector("#memo-form-status");
const submitButton = form.querySelector('button[type="submit"]');

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const title = data.get("title").trim();
    const content = data.get("content");

    if (!title || !content.trim()) {
        formStatus.textContent = "タイトルと本文を入力してください。";
        return;
    }

    const memoId = editMemoId;
    const isEditing = memoId !== null;
    submitButton.disabled = true;
    formStatus.textContent = isEditing ? "更新中..." : "登録中...";

    try {
        if (isEditing) {
            await updateMemo(memoId, title, content);
        }
        else {
            await createMemo(title, content);
        }

        editMemoId = null;
        form.reset();
        submitButton.textContent = "登録";
        formStatus.textContent = isEditing ? "メモを更新しました。" : "メモを登録しました。";
        await showMemos();
    }
    catch (error) {
        console.error(error);
        formStatus.textContent = isEditing ? "メモを更新できませんでした。" : "メモを登録できませんでした。";
    }
    finally {
        submitButton.disabled = false;
    }
});