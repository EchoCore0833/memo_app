import { fetchMemos, createMemo, updateMemo, deleteMemo } from "./api.js";
import { sortMemos } from "./features/sort.js";
import { initializeDraft, restoreDraft, clearDraft } from "./features/draft.js";
import { initializeUnsavedWarning, canLeaveMemo, markAsSaved } from "./features/unsavedWarning.js";
import { initializeMemoSocket } from "./features/websocket.js";

const list = document.querySelector("#memo-list");
const listStatus = document.querySelector("#memo-status");
const form = document.querySelector("#memo-form");
const titleInput = document.querySelector("#memo-title");
const contentInput = document.querySelector("#memo-content");
const newButton = document.querySelector("#new-memo-button");
const deleteButton = document.querySelector("#delete-memo-button");
const saveButton = form.querySelector('button[type="submit"]');
const formStatus = document.querySelector("#memo-form-status");
const sortSlect = document.querySelector("#memo-sort");
const draftOptions = { 
    titleInput, contentInput, form, getSlectedId: () => selectedId 
};
const warningOptions = { 
    titleInput, contentInput, form 
};
const websocketOptions = {
    url: `ws://${window.location.hostname}:3000`,
    onMemoChanged: () => {
        loadMemos();
    }
}

let memos = [];
let selectedId = null;

function formatDate(value) {
    const date = new Date(value);

    return new Intl.DateTimeFormat("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    }).format(date);
}

function renderMemos() {
    list.replaceChildren();

    const sorttedMemos = sortMemos(memos, sortSelect.value);

    for (const memo of memos) {
        const item = document.createElement("li");
        const button = document.createElement("button");
        const title = document.createElement("span");
        const date = document.createElement("span");

        button.type = "button";
        button.className = "memo-item";

        if (memo.id === selectedId) {
            button.classList.add("selected");
        }

        title.className = "memo-item-title";
        title.textContent = memo.title;

        date.className = "memo-item-date";
        date.textContent = formatDate(memo.updatedAt);

        button.append(title, date);

        button.addEventListener("click", () => {
            selectMemo(memo.id);
        });

        item.append(button);
        list.append(item);
    }

    if (memos.length === 0) {
        listStatus.textContent = "メモはまだありません。";
    }
    else {
        listStatus.textContent = "";
    }
}

function selectMemo(id) {
    if (id === selectedId) {
        return;
    }

    if (!canLeaveMemo(warningOptions)) {
        return;
    }

    const memo = memos.find((item) => item.id === id);

    if (!memo) {
        return;
    }

    selectedId = memo.id;
    titleInput.value = memo.title;
    contentInput.value = memo.content;
    restoreDraft(draftOptions);
    markAsSaved(warningOptions);
    deleteButton.disabled = false;
    formStatus.textContent = "";

    renderMemos();
}

function startNewMemo() {
    if (!canLeaveMemo(warningOptions)) {
        return;
    }

    selectedId = null;
    form.reset();
    restoreDraft(draftOptions);
    markAsSaved(warningOptions);
    deleteButton.disabled = true;
    formStatus.textContent = "";
    titleInput.focus();

    renderMemos();
}

async function loadMemos() {
    listStatus.textContent = "読み込み中...";

    try {
        memos = await fetchMemos();

        if (
            selectedId !== null &&
            !memos.some((memo) => memo.id === selectedId)
        ) {
            startNewMemo();
            return;
        }

        renderMemos();
    }
    catch (error) {
        console.error(error);
        listStatus.textContent = "メモ一覧を読み込めませんでした。";
    }
}

newButton.addEventListener("click", () => {
    startNewMemo();
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = titleInput.value;
    const content = contentInput.value;
    const editingId = selectedId;

    saveButton.disabled = true;
    deleteButton.disabled = true;
    formStatus.textContent = "保存中...";

    try {
        let savedMemo;

        if (editingId === null) {
            savedMemo = await createMemo(title, content);
            memos.unshift(savedMemo);
        }
        else {
            savedMemo = await updateMemo(editingId, title, content);

            memos = memos.map((memo) => {
                if (memo.id === editingId) {
                    return savedMemo;
                }

                return memo;
            });
        }

        selectedId = savedMemo.id;
        clearDraft(draftOptions);
        titleInput.value = savedMemo.title;
        contentInput.value = savedMemo.content;
        deleteButton.disabled = false;
        formStatus.textContent = "保存しました。";

        renderMemos();
    }
    catch (error) {
        console.error(error);
        deleteButton.disabled = selectedId === null;
        formStatus.textContent = "保存できませんでした。";
    }
    finally {
        saveButton.disabled = false;
    }
});

deleteButton.addEventListener("click", async () => {
    if (selectedId === null) {
        return;
    }

    const deletingId = selectedId;

    if (!window.confirm("このメモを削除しますか？")) {
        return;
    }

    saveButton.disabled = true;
    deleteButton.disabled = true;
    formStatus.textContent = "削除中...";

    try {
        await deleteMemo(deletingId);

        memos = memos.filter((memo) => {
            return memo.id !== deletingId;
        });

        selectedId = null;
        form.reset();
        clearDraft(draftOptions);
        formStatus.textContent = "削除しました。";
        markAsSaved(warningOptions);

        renderMemos();
    }
    catch (error) {
        console.error(error);
        deleteButton.disabled = false;
        formStatus.textContent = "削除できませんでした。";
    }
    finally {
        saveButton.disabled = false;
    }
});

sortSlect.addEventListener("change", () => {
    renderMemos();
})

initializeDraft(draftOptions);
initializeUnsavedWarning(warningOptions);
initializeWebSocket(websocketOptions);

loadMemos();