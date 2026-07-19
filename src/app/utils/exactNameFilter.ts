/**
 * Escape special regex characters so user input can be used in a RegExp safely.
 */
export const escapeRegExp = (value: string) =>
    value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Normalize a display name for uniqueness checks:
 * - trim edges
 * - collapse repeated whitespace
 * - lowercase
 * - strip zero-width chars
 */
export const normalizeName = (value: string) =>
    value
        .normalize("NFC")
        .replace(/[\u200B-\u200D\uFEFF]/g, "")
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase();

/**
 * Keep readable casing but collapse messy whitespace before saving.
 */
export const cleanDisplayName = (value: string) =>
    value
        .normalize("NFC")
        .replace(/[\u200B-\u200D\uFEFF]/g, "")
        .trim()
        .replace(/\s+/g, " ");

/**
 * Case-insensitive exact match that also ignores extra spaces in DB values.
 * Example: "Kuakata  Sea Beach" matches "Kuakata Sea Beach"
 */
export const exactNameFilter = (field: string, value: string) => {
    const cleaned = cleanDisplayName(value);
    const pattern = escapeRegExp(cleaned).replace(/ /g, "\\s+");

    return {
        [field]: {
            $regex: `^\\s*${pattern}\\s*$`,
            $options: "i",
        },
    };
};
