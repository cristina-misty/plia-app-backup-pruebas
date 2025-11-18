// Generic search helpers to reuse across components

export type MatchMode = "AND" | "OR";

// Normalize: to lower case, remove accents, trim
export function normalizeString(s: unknown): string {
  return (s ?? "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

// Split query into tokens (words)
export function tokenizeQuery(q: string): string[] {
  return normalizeString(q).split(/\s+/).filter(Boolean);
}

// Check if haystack contains tokens with given mode
export function matchesTokens(
  haystack: string,
  tokens: string[],
  mode: MatchMode = "AND"
) {
  if (tokens.length === 0) return true;
  if (mode === "AND") return tokens.every((t) => haystack.includes(t));
  return tokens.some((t) => haystack.includes(t));
}

// Build a normalized haystack string from an array of fields
export function buildHaystack(fields: Array<unknown>): string {
  return fields.filter(Boolean).map(normalizeString).join(" ");
}

// High-level helper: filter items by query using a haystack getter or fields getter
export function filterByQuery<T>(
  items: T[],
  query: string,
  getHaystackOrFields: (item: T) => string | Array<unknown>,
  options: { mode?: MatchMode } = { mode: "AND" }
): T[] {
  const q = normalizeString(query);
  if (!q) return items;
  const tokens = tokenizeQuery(q);
  const mode = options.mode ?? "AND";
  return items.filter((item) => {
    const value = getHaystackOrFields(item);
    const haystack = Array.isArray(value) ? buildHaystack(value) : normalizeString(value);
    return matchesTokens(haystack, tokens, mode);
  });
}
