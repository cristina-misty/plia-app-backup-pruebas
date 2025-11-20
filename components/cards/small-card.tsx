import React from "react";
import { Card, CardContent } from "../ui/card";

const SmallCard = ({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
  description?: string;
}) => {
  return (
    <Card className="max-w-md h-full">
      <CardContent>
        <div className="text-bold text-lg flex flex-col">
          <p className="font-bold ">{title}</p>
          <p className="text-default-500 text-2xl">
            {icon}
            {value}
          </p>
          {description && (
            <p className="text-muted-foreground text-xs mt-2">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SmallCard;
