"use client";

import React from "react";

export type TruncateTextProps = {
  text: string;
  /** Limita por número de caracteres (cuando se usa mode="chars") */
  maxChars?: number;
  /** Modo de truncado: por caracteres o por CSS ellipsis/line-clamp */
  mode?: "chars" | "css";
  /** Número de líneas a mostrar cuando mode="css" (1 = ellipsis en una línea) */
  lines?: number;
  /** Clase extra */
  className?: string;
  /** Texto del tooltip (por defecto: el texto completo) */
  title?: string;
};

function clampChars(text: string, max: number) {
  if (!max || text.length <= max) return text;
  return text.slice(0, Math.max(0, max - 1)) + "…";
}

/**
 * Componente para truncar texto de forma reutilizable.
 * - mode="chars": corta por número de caracteres.
 * - mode="css": aplica ellipsis (1 línea) o line-clamp (n líneas) vía estilos.
 */
export function TruncateText({
  text,
  maxChars = 50,
  mode = "chars",
  lines = 1,
  className,
  title,
}: TruncateTextProps) {
  if (mode === "chars") {
    return (
      <span className={className} title={title ?? text}>
        {clampChars(text, maxChars)}
      </span>
    );
  }

  // mode === "css": ellipsis/line-clamp
  const style =
    lines <= 1
      ? { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }
      : {
          display: "-webkit-box",
          WebkitLineClamp: lines,
          WebkitBoxOrient: "vertical" as const,
          overflow: "hidden",
        };

  return (
    <span className={className} style={style} title={title ?? text}>
      {text}
    </span>
  );
}

export default TruncateText;