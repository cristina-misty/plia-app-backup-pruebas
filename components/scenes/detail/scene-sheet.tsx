import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function SceneSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Screenplay</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Dialogue</SheetTitle>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          Screenplay example
        </div>
      </SheetContent>
    </Sheet>
  );
}
