"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DetailProps } from "@/types/detail/detail-page";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

/**
 * 💡 Componente de detalle genérico reutilizable
 * - Pinta título, badges, identificadores, descripción y secciones en acordeón
 * - No conoce el tipo de entidad (Character, Location, Scene, etc.)
 */
export default function DetailPage({
  title,
  badges = [],
  identifiers = {},
  generalSection,
  detailSections = [],
  emptyText = "No additional details available.",
  className = "",
  relatedList,
  children,
}: DetailProps) {
  return (
    <div className={`space-y-4 pb-16 ${className}`}>
      {/* Header */}
      <div id="detail-title" className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-4xl font-bold">{title}</h1>
          {badges.map((badge, i) => (
            <Badge key={i} className="text-sm" variant={badge.variant as any}>
              {badge.label}
            </Badge>
          ))}
        </div>

        {Object.keys(identifiers).length > 0 && (
          <p className="text-sm text-muted-foreground flex flex-col">
            {Object.entries(identifiers).map(([label, value], i) =>
              value ? (
                <span
                  key={`${label}-${i}`}
                  className="inline-flex items-center gap-1.5"
                >
                  {label ? <>{label}: </> : null}
                  {value}
                </span>
              ) : null
            )}
          </p>
        )}
      </div>

      {/* Lista relacionada genérica */}
      {relatedList?.items?.length ? (
        <div id="detail-related" className="mt-2">
          <p className="text-sm font-semibold">
            {relatedList.title ?? "Related"}
          </p>
          <ul
            role="list"
            aria-label={relatedList.title ?? "Related"}
            className="mt-2 flex flex-wrap gap-2"
          >
            {relatedList.items.map((item) => (
              <li key={item.id} role="listitem">
                {item.href ? (
                  <Link
                    href={item.href}
                    onClick={item.onClick}
                    className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-600 rounded"
                    aria-label={`Open ${item.label}`}
                  >
                    <Badge variant="outline" className="cursor-pointer">
                      {item.label || "—"}
                    </Badge>
                  </Link>
                ) : (
                  <Badge variant="outline" className="cursor-default">
                    {item.label || "—"}
                  </Badge>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <Separator />

      {/* Descripción general */}
      {generalSection?.textMain ? (
        <div id="detail-description" className="space-y-1">
          <Card className="p-8 mb-4 bg-muted-foreground text-secondary">
            {generalSection.titleMain && (
              <p className="text-2xl font-bold">{generalSection.titleMain}</p>
            )}
            <p className="text-md whitespace-pre-line text-justify">
              {generalSection.textMain}
            </p>
          </Card>
        </div>
      ) : null}

      {/* Contenido extra opcional (por ejemplo, tarjetas personalizadas) */}
      {children}

      {/* Secciones de detalle */}
      {detailSections.length > 0 ? (
        <div id="detail-sections" className="pt-4">
          <Accordion type="multiple" className="w-full space-y-2">
            {detailSections.map((section) => (
              <AccordionItem
                key={section.key}
                value={section.key}
                className="px-4 bg-card rounded-2xl"
              >
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  {section.title}
                </AccordionTrigger>
                <AccordionContent className="pt-2 text-md text-muted-foreground leading-relaxed whitespace-pre-line">
                  <ReactMarkdown>{section.text}</ReactMarkdown>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{emptyText}</p>
      )}
    </div>
  );
}
