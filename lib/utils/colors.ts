export function getTailwindPaletteClass(value: unknown): string | undefined {
  if (value == null) return undefined;
  const raw = String(value).trim();
  const v = raw.toLowerCase();

  if (v.startsWith("#") || v.startsWith("rgb")) return undefined;

  const PALETTES: Record<string, string> = {
    yellow: "bg-[var(--yellow)] text-[var(--standard-black)]",
    "light-green":
      "bg-[var(--light-green)] text-foreground dark:text-background",
    "dark-blue": "bg-[var(--dark-blue)] text-background dark:text-foreground",
    standard: "bg-[var(--standard-white)] text-[var(--standard-black)]",
    other: "bg-[var(--other)] text-foreground dark:text-background",
  };

  return PALETTES[v] ?? undefined;
}

/**
 * Alias: devuelve clases Tailwind únicamente a partir del nombre.
 */
export function getTailwindPaletteClassForName(
  name: string
): string | undefined {
  return getTailwindPaletteClass(name);
}

export function getTailwindBorderClass(value: unknown): string | undefined {
  if (value == null) return undefined;
  const raw = String(value).trim();
  const v = raw.toLowerCase();
  const BORDER: Record<string, string> = {
    yellow: "border-[var(--yellow)]",
    "light-green": "border-[var(--light-green)]",
    "dark-blue": "border-[var(--dark-blue)]",
    standard: "border-[var(--standard-white)]",
    other: "border-[var(--other)]",
  };
  return BORDER[v] ?? undefined;
}
