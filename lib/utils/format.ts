export function formatTimestampToDate(timestamp: number): string {
  const date = new Date(
    timestamp.toString().length === 10 ? timestamp * 1000 : timestamp
  );
  const locale =
    typeof navigator !== "undefined" ? navigator.language : "en-US";

  return date.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Formatea un timestamp (en segundos o milisegundos), cadena numérica o Date
 * y devuelve textos de fecha y hora, además del ISO para usar en <time/>.
 * Maneja valores inválidos devolviendo "—" y nulls apropiados.
 */
export function formatDateAndTime(
  input: number | string | Date | null | undefined,
  opts?: {
    dateStyle?: Intl.DateTimeFormatOptions["dateStyle"];
    timeStyle?: Intl.DateTimeFormatOptions["timeStyle"];
  }
): { dateText: string; timeText: string | null; iso: string | null; date: Date | null; valid: boolean } {
  const dateStyle = opts?.dateStyle ?? "medium";
  const timeStyle = opts?.timeStyle ?? "short";

  let date: Date | null = null;
  if (input instanceof Date) {
    date = input;
  } else if (typeof input === "number") {
    const ms = input.toString().length === 10 ? input * 1000 : input;
    date = Number.isFinite(ms) ? new Date(ms) : null;
  } else if (typeof input === "string") {
    const num = Number(input);
    const ms = input.length === 10 ? num * 1000 : num;
    date = Number.isFinite(ms) ? new Date(ms) : null;
  }

  if (!date || isNaN(date.getTime())) {
    return { dateText: "—", timeText: null, iso: null, date: null, valid: false };
  }

  const dateText = new Intl.DateTimeFormat(undefined, { dateStyle }).format(date);
  const timeText = new Intl.DateTimeFormat(undefined, { timeStyle }).format(date);
  const iso = date.toISOString();

  return { dateText, timeText, iso, date, valid: true };
}

/**
 * Normaliza una lista de cadenas que puede venir como CSV (string) o como array.
 * - Recorta espacios
 * - Elimina vacíos
 * - Deduplica (por defecto, case-insensitive)
 * - Permite transformar, filtrar y ordenar
 */
export type NormalizeStringListOptions = {
  delimiter?: string | RegExp; // sólo si input es string
  trim?: boolean; // default: true
  lowercaseForDedup?: boolean; // default: true
  unique?: boolean; // default: true
  sort?: boolean; // default: false
  map?: (s: string) => string;
  filter?: (s: string) => boolean;
};

export function normalizeStringList(
  input: string | string[] | null | undefined,
  opts: NormalizeStringListOptions = {}
): string[] {
  const {
    delimiter = ",",
    trim = true,
    lowercaseForDedup = true,
    unique = true,
    sort = false,
    map,
    filter,
  } = opts;

  let items: string[] = [];
  if (Array.isArray(input)) {
    items = input as string[];
  } else if (typeof input === "string") {
    items = input.split(delimiter as any);
  } else {
    return [];
  }

  let values = items
    .map((s) => (trim ? String(s).trim() : String(s)))
    .filter(Boolean);

  if (map) values = values.map(map);
  if (filter) values = values.filter(filter);

  if (unique) {
    const seen = new Set<string>();
    const uniq: string[] = [];
    for (const v of values) {
      const key = lowercaseForDedup ? v.toLocaleLowerCase() : v;
      if (seen.has(key)) continue;
      seen.add(key);
      uniq.push(v);
    }
    values = uniq;
  }

  if (sort) values = values.slice().sort((a, b) => a.localeCompare(b));

  return values;
}

export function joinStringList(
  values: string[] | null | undefined,
  delimiter = ", "
): string {
  if (!values || values.length === 0) return "—";
  return values.join(delimiter);
}

export function normalizeAndJoin(
  input: string | string[] | null | undefined,
  opts?: NormalizeStringListOptions,
  delimiter = ", "
): string {
  return joinStringList(normalizeStringList(input, opts), delimiter);
}

export function parseToSeconds(v: unknown): number {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  const str = String(v).trim();
  if (!str) return 0;
  if (/^\d+$/.test(str)) return parseInt(str, 10);
  const parts = str.split(":").map((p) => parseInt(p, 10));
  if (parts.some((n) => Number.isNaN(n))) return 0;
  if (parts.length === 2) {
    const [mm, ss] = parts;
    return mm * 60 + ss;
  }
  if (parts.length === 3) {
    const [hh, mm, ss] = parts;
    return hh * 3600 + mm * 60 + ss;
  }
  return 0;
}

export function formatHMS(totalSeconds: number): string {
  const hh = Math.floor(totalSeconds / 3600);
  const mm = Math.floor((totalSeconds % 3600) / 60);
  const ss = totalSeconds % 60;
  return `${hh}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

export function filterScenesByEpisode<T extends { episode_order?: unknown }>(
  items: T[] | null | undefined,
  selected?: string | string[] | null
): T[] {
  const list = Array.isArray(items) ? items : [];
  const selections = normalizeStringList(selected, { trim: true, unique: true, lowercaseForDedup: true });
  if (selections.length === 0 || selections.includes("all")) return list;
  const set = new Set(selections.map((s) => s.toLowerCase()));
  return list.filter((item) => set.has(String((item as any)?.episode_order ?? "").toLowerCase()));
}

export function sumScreenTime<T extends { screen_time?: unknown }>(
  items: T[] | null | undefined
): number {
  const list = Array.isArray(items) ? items : [];
  return list.reduce((acc, cur) => acc + parseToSeconds((cur as any)?.screen_time), 0);
}
