export function initializeDraft(options) {
    const {
        titleInput,
        contentInput,
        form,
        formStatus,
        getSelectedId,
        hasUnsavedChanges,
    } = options;

    const savedMessage = "下書きを保存しました。";

    form.addEventListener("input", () => {
        if (!hasUnsavedChanges()) {
            clearDraft();
            if (formStatus.textContent === savedMessage) {
                formStatus.textContent = "";
            }
            return;
        }

        const draft = {
            memoId: getSelectedId(),
            title: titleInput.value,
            content: contentInput.value,
        };

        try {
            localStorage.setItem("memo-app:draft", JSON.stringify(draft));
            formStatus.textContent = savedMessage;
        } catch (error) {
            console.error("自動保存に失敗しました", error);
        }
    });
}

export function restoreDraft(options) {
    // C担当: 保存されている下書きを復元する処理
    try {

        const savedDraft = localStorage.getItem("memo-app:draft");

        if (savedDraft === null) {
            return null;
        }

        const draft = JSON.parse(savedDraft);

        return draft;

    } catch (error) {
        console.error("下書きの取得に失敗しました", error);
        return null;
    }

}

export function clearDraft(options) {
    // C担当: 保存済みの下書きを削除する処理
    try {
        localStorage.removeItem("memo-app:draft");
    } catch (error) {
        console.error("下書きの削除に失敗しました", error);
    }

}