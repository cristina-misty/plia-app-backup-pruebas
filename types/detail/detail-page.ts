export interface DetailSection {
  key: string;
  title?: string;
  text: string;
}

export interface DetailBadge {
  label: string;
  variant?: "default" | "outline" | string;
}

export interface DetailProps {
  /** Título principal */
  title: string;

  /** Badges (opcionales) */
  badges?: DetailBadge[];

  /** Identificadores extra (ej: ID, Serie, Tipo...) */
  identifiers?: Record<string, React.ReactNode>;

  /** Descripción general (opcional) */
  generalSection?: { titleMain?: string; textMain?: string };

  /** Secciones tipo acordeón */
  detailSections?: DetailSection[];

  /** Lista relacionada genérica (ej. sets secundarios asociados) */
  relatedList?: {
    title?: string;
    items: { id: string; label: string; href?: string; onClick?: () => void }[];
  };

  /** Texto si no hay detalles */
  emptyText?: string;

  /** Clase extra (para ajustes de layout) */
  className?: string;

  children?: React.ReactNode;
}
