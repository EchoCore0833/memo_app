let savedTitle = "";
let savedContent = "";

export function initializeUnsavedWarning(options) {
    window.addEventListener("beforeunload", (event) => {
        const hasChanges =
            options.titleInput.value !== savedTitle ||
            options.contentInput.value !== savedContent;

        if (hasChanges) {
            event.preventDefault();
        }
    });
}

export function canLeaveMemo(options) {
    // D担当: 未保存の変更がある場合に確認する
    const currentTitle = options.titleInput.value;
    const currentContent = options.contentInput.value;

    // 保存時と現在の内容を比較
    const hasChanges =
        currentTitle !== savedTitle ||
        currentContent !== savedContent;

    if (hasChanges) {
        return window.confirm("未保存の変更があります。移動しますか？");
    }

    return true;
}

export function markAsSaved(options) {
    // D担当: 現在の入力内容を保存済みとして記録する
    savedTitle = options.titleInput.value;
    savedContent = options.contentInput.value;
}