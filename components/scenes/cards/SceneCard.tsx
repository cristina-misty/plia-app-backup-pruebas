"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import TruncateText from "@/components/ui/truncate-text";
import { stringToColorPallete } from "@/lib/utils/badges";
import { EyeIcon } from "lucide-react";
import { IconNotes } from "@tabler/icons-react";

export default function SceneCard({ item }: { item: any }) {
  const names = Array.isArray(item?.chars_total)
    ? item.chars_total.join(", ")
    : String(item?.chars_total ?? "");
  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm text-muted-foreground">
        Scene {String(item?.scene_id ?? "—")}
      </div>
      <div className="text-lg font-semibold">
        <TruncateText maxChars={50} text={String(item?.scene_title ?? "—")} />
      </div>
      <div className="flex items-center gap-2 text-sm">
        <TruncateText
          maxChars={100}
          text={String(item?.scene_synopsis ?? "—")}
        />
      </div>
      <div className="flex items-center gap-2 flex-wrap text-sm">
        <Badge variant="outline">Ep {String(item?.episode_order ?? "—")}</Badge>
        <Badge
          variant="outline"
          className={stringToColorPallete(item?.int_ext)}
        >
          {String(item?.int_ext ?? "—")}
        </Badge>
        <Badge
          variant="outline"
          className={stringToColorPallete(item?.day_night)}
        >
          {String(item?.day_night ?? "—")}
        </Badge>
        <Badge variant="outline">
          <IconNotes /> {String(item?.length ?? "—")}
        </Badge>
        <Badge variant="outline">
          <EyeIcon />
          {String(item?.screen_time ?? "—")}
        </Badge>
      </div>
      <div className="text-xs text-muted-foreground">Cast: {names || "—"}</div>
    </div>
  );
}
