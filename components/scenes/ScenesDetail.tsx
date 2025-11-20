"use client";

import React from "react";
import { Card } from "../ui/card";
import { Separator } from "../ui/separator";
import { SceneDetailTabs } from "./detail/scene-details-tabs";
import {
  IconUsers,
  IconFileText,
  IconBuilding,
  IconHistory,
  IconFileDescription,
  IconVersions,
  IconCalendar,
} from "@tabler/icons-react";
import {
  exampleDepartments,
  exampleDepartmentsTab,
  exampleDialogue,
  headerInfo,
  tabs,
} from "@/data/scene-detail";
import { SceneDetailHeader } from "./detail/scene-detail-header";
import { SceneNote } from "./detail/scene-note";
import { SceneSheet } from "./detail/scene-sheet";
import { useSelectedSceneStore } from "@/store/scenes/selectedScene";
import type { Scene } from "@/types/api/scenes";
import { useBreadcrumbStore } from "@/store/general/breadcrumb";

const ScenesDetail = () => {
  const selected = useSelectedSceneStore((s) => s.selected) as Scene | null;
  const [mounted, setMounted] = React.useState(false);
  const setDetailLabel = useBreadcrumbStore((s) => s.setDetailLabel);
  const clearDetailLabel = useBreadcrumbStore((s) => s.clearDetailLabel);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const header =
    mounted && selected
      ? {
          episode_order: selected.episode_order || "",
          scene_id: selected.scene_id || "",
          scene_title: selected.scene_title || "",
          screen_time: selected.screen_time || "",
          int_ext: selected.int_ext || "",
          day_night: selected.day_night || "",
          location: selected.location || "",
          synopsis: selected.scene_synopsis || "",
          emotion_label: selected.emotion_label || "",
        }
      : headerInfo;

  React.useEffect(() => {
    const label = header?.scene_id || header?.scene_title || "";
    if (label) setDetailLabel(label);
    return () => clearDetailLabel();
  }, [header?.scene_id, header?.scene_title, setDetailLabel, clearDetailLabel]);

  return (
    <div className="w-full h-full flex flex-col items-start gap-3">
      <SceneDetailHeader scene={header} /> (lo demás está mock como ejemplo)
      {/* --------- tabs ---------- */}
      <Separator />
      {(() => {
        const tabItems = tabs;
        const icons = {
          cast: <IconUsers className="size-4" />,
          screenplay: <IconFileText className="size-4" />,
          departments: <IconBuilding className="size-4" />,
          history: <IconHistory className="size-4" />,
          docs: <IconFileDescription className="size-4" />,
          version: <IconVersions className="size-4" />,
          calendar: <IconCalendar className="size-4" />,
        } as const;

        const contents: Record<string, React.ReactNode> = {
          cast: (
            <div className="flex flex-col items-start justify-center gap-3 text-xl">
              <div className="w-full flex flex-col gap-2">
                <p className="font-bold uppercase">
                  CAST:{" "}
                  <span className="text-muted-foreground font-medium">
                    FER, CEO, INES
                  </span>
                </p>
                <p className="font-bold uppercase">
                  TOTAL CAST:{" "}
                  <span className="text-muted-foreground font-medium">
                    FER, CEO, INES, ABOGADO, RA
                  </span>
                </p>
              </div>
            </div>
          ),
          screenplay: (
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-4">
                <p className="text-muted-foreground text-justify text-sm flex flex-col">
                  <span className="uppercase text-lg font-bold text-foreground">
                    Actions:
                  </span>
                  Las luces blancas de la sala agudizan las expresiones
                  demacradas de GALARRETA y VALENZUELA, de pie, camisas
                  remangadas, destensados los nudos de las corbatas. Echan un
                  vistazo a DELIA, que sigue sentada, impecable, impasible.
                  Entran INÉS, el CEO y GALÁN. El CEO se dirige hacia VALENZUELA
                  y le alarga la mano. Valenzuela le estrecha la mano, con una
                  sonrisa fría. Delia mira con cierta preocupación a una
                  derrotada Inés.
                </p>
              </div>
              <Separator className="my-2" />
              <div>
                <p className="uppercase font-bold text-foreground text-justify text-lg mb-4">
                  Dialogue:
                </p>
                <div className="flex flex-col gap-4">
                  {exampleDialogue.map((dialog) => (
                    <Card
                      key={dialog.id}
                      className="max-w-xl p-4 flex flex-col gap-2"
                    >
                      <p className="font-bold">{dialog.name}</p>
                      <p className="text-muted-foreground">{dialog.dialog}</p>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          ),
          departments: (
            <>
              {exampleDepartmentsTab.map((department, i) => (
                <div key={i} className="flex items-center gap-3 my-2">
                  <Card className="w-full p-4 flex flex-col gap-2 bg-green-50 text-muted-foreground">
                    <p className="font-bold">{department.name}</p>
                    {department?.text?.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </Card>
                </div>
              ))}
            </>
          ),
          history: <>Change your history here.</>,
          docs: <>Change your docs here.</>,
          version: <>Change your version here.</>,
          calendar: <>Change your calendar here.</>,
        };

        return (
          <SceneDetailTabs
            tabs={tabItems}
            contents={contents}
            defaultValue="cast"
            icons={icons as any}
            rightActions={
              <>
                <SceneNote departments={exampleDepartments} />
                <SceneSheet />
              </>
            }
          />
        );
      })()}
    </div>
  );
};

export default ScenesDetail;
