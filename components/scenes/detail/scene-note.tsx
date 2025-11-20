import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ExampleDepartmentsProps } from "@/data/scene-detail";
import { useIsMobile } from "@/hooks/general/use-mobile";

import { IconNotes } from "@tabler/icons-react";

export function SceneNote({
  departments,
}: {
  departments: ExampleDepartmentsProps[];
}) {
  const isMobile = useIsMobile();

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default" className="shrink-0">
            <IconNotes />
            {isMobile ? "" : "Create notes"}
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new note</DialogTitle>
            <DialogDescription>
              Select a department to assign the note to.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-wrap gap-3">
            {departments.map((department) => (
              <div className="flex items-center gap-3" key={department.id}>
                <Checkbox id={department.id} />
                <Label htmlFor={department.id}>{department.name}</Label>
              </div>
            ))}
          </div>
          <Separator />
          <div className="grid w-full gap-3">
            <Label htmlFor="message">Your message:</Label>
            <Textarea placeholder="Type your message here." id="message" />
            <Button>Send note</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
