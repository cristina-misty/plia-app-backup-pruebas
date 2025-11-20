import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { HeaderInfoProps } from "@/data/scene-detail";

export function SceneDetailHeader({ scene }: { scene: HeaderInfoProps }) {
  return (
    <div className="w-full flex gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
      <Card
        id="scene"
        className="min-w-[300px] max-w-[450px] w-full flex flex-col gap-2 p-4"
      >
        <div className="flex justify-between items-center text-muted-foreground">
          <p>Scene</p>
          <p className="text-xs">Version de prueba</p>
        </div>
        <p className="text-2xl font-bold uppercase">{scene.scene_id}</p>
        <div className="flex justify-between items-center gap-4 uppercase text-muted-foreground">
          <p>{scene.scene_title}</p>
          <p>{scene.screen_time}</p>
        </div>
      </Card>

      <Card
        id="heading"
        className="min-w-[300px] max-w-[350px] w-full flex flex-col gap-2 p-4"
      >
        <div className="text-muted-foreground">
          <p>Heading</p>
        </div>
        <div className="flex justify-between items-center text-2xl font-bold uppercase">
          <p>{scene.int_ext}</p>
          <p>{scene.day_night}</p>
        </div>
        <p className="text-muted-foreground">{scene.location}</p>
      </Card>

      <Card
        id="summary"
        className="min-w-[300px] w-full flex flex-col gap-2 p-4"
      >
        <div className="flex justify-between items-center text-muted-foreground">
          <p>Summary</p>
          <Badge>{scene.emotion_label}</Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-4">{scene.synopsis}</p>
      </Card>
    </div>
  );
}
