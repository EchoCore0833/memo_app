export function sortMemos(memos, sortType) {
    const sorted = [...memos];

    switch (sortType) {
        case "updated-desc":
            return sorted.sort((a, b) => new Date(b.updatedAt || b.updated_at) - new Date(a.updatedAt || a.updated_at));
        case "updated-asc":
            return sorted.sort((a, b) => new Date(a.updatedAt || a.updated_at) - new Date(b.updatedAt || b.updated_at));
        case "created-desc":
            return sorted.sort((a, b) => new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at));
        case "created-asc":
            return sorted.sort((a, b) => new Date(a.createdAt || a.created_at) - new Date(b.createdAt || b.created_at));
        case "title-asc":
            return sorted.sort((a, b) => (a.title || "").localeCompare(b.title || "", "ja"));
        case "title-desc":
            return sorted.sort((a, b) => (b.title || "").localeCompare(a.title || "", "ja"));
        default:
            return sorted;
    }
}