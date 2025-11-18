export function stringToColorClass(value: string) {
  const colors = [
    "bg-blue-100 text-blue-800",
    "bg-purple-100 text-purple-800",
    "bg-green-100 text-green-800",
    "bg-pink-100 text-pink-800",
    "bg-orange-100 text-orange-800",
    "bg-cyan-100 text-cyan-800",
    "bg-amber-100 text-amber-800",
    "bg-indigo-100 text-indigo-800",
    "bg-yellow-100 text-yellow-800",
  ];

  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

export function stringToColorPallete(value: string) {
  const v = String(value ?? "")
    .trim()
    .toLowerCase();

  const isInterior =
    v === "int" ||
    v === "interior" ||
    v.includes("int") ||
    v.includes("interior");
  const isExterior =
    v === "ext" ||
    v === "exterior" ||
    v.includes("ext") ||
    v.includes("exterior");
  const isDay =
    v === "day" ||
    v === "día" ||
    v.includes("morning") ||
    v.includes("mañana") ||
    v === "pending" ||
    v.includes("planned") ||
    v.includes("planificado") ||
    v === "todo" ||
    v === "warning" ||
    v === "draft" ||
    v === "paused" ||
    v === "pausado";
  const isNight = v === "night" || v === "noche";
  const isSuccess =
    v === "success" ||
    v === "completed" ||
    v === "complete" ||
    v === "done" ||
    v === "ok" ||
    v === "active" ||
    v === "activo" ||
    v === "activa" ||
    v === "ready" ||
    v === "listo";
  const isDoc =
    v === "document" ||
    v === "doc" ||
    v === "file" ||
    v === "pdf" ||
    v === "report" ||
    v === "info" ||
    v === "note" ||
    v === "nota";

  if (isInterior)
    return "bg-[var(--standard-white)] text-[var(--standard-black)]";
  if (isExterior)
    return "bg-[var(--standard-black)] text-[var(--standard-white)]";
  if (isDay) return "bg-[var(--standard-white)] text-[var(--standard-black)]";
  if (isNight) return "bg-[var(--standard-black)] text-[var(--standard-white)]";
  if (isSuccess)
    return "bg-[var(--light-green)] text-foreground dark:text-background";
  if (isDoc)
    return "bg-[var(--dark-blue-secondary)] text-background dark:text-foreground";

  return "bg-[var(--standard-other)] text-foreground dark:text-background";
}

export function stringToColorCast(value: string) {
  const v = String(value ?? "")
    .trim()
    .toLowerCase();

  const isProtagonist = v.includes("protagonist");
  const isSecondary = v.includes("secondary");
  const isSmallParts = v.includes("small");
  const isSupportingCast = v.includes("supporting");

  if (isProtagonist)
    return "bg-[var(--dark-orange)] text-[var(--standard-white)]";
  if (isSecondary)
    return "bg-[var(--dark-yellow)] text-[var(--standard-black)]";
  if (isSmallParts)
    return "bg-[var(--dark-green)] text-[var(--standard-white)]";
  if (isSupportingCast)
    return "bg-[var(--dark-blue-secondary)] text-[var(--standard-white)]";

  return "bg-[var(--standard-other)] text-foreground dark:text-background";
}
