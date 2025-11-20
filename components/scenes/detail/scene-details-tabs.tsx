"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
//
import { useSceneTabsStore } from "@/store/scenes/sceneTabs";

type TabItem = { id: string; name: string };

type TabContents = Record<
  string,
  React.ReactNode | ((active: boolean) => React.ReactNode)
>;

interface SceneDetailTabsProps {
  tabs: TabItem[];
  contents: TabContents;
  defaultValue?: string;
  onChange?: (value: string) => void;
  icons?: Record<string, React.ReactNode>;
  className?: string;
  listClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
  scrollable?: boolean;
  rightActions?: React.ReactNode;
}

/**
 * SceneDetailTabs
 * Componente de tabs reutilizable para escenas.
 * Controla el valor activo vía store de Zustand y permite personalización.
 */
export function SceneDetailTabs({
  tabs,
  contents,
  defaultValue,
  onChange,
  icons,
  className,
  listClassName,
  triggerClassName,
  contentClassName,
  scrollable = true,
  rightActions,
}: SceneDetailTabsProps) {
  const { activeTab, setActiveTab } = useSceneTabsStore();

  const first = tabs[0]?.id ?? "";
  const value = activeTab || defaultValue || first;

  React.useEffect(() => {
    if (!activeTab && (defaultValue || first)) setActiveTab(defaultValue || first);
  }, [activeTab, defaultValue, first, setActiveTab]);

  const handleChange = React.useCallback(
    (v: string) => {
      setActiveTab(v);
      onChange?.(v);
    },
    [onChange, setActiveTab]
  );

  return (
    <Tabs value={value} onValueChange={handleChange} className={cn("w-full", className)}>
      <div className={cn("w-full flex gap-2 items-start")}> 
        <div className={cn(scrollable && "w-full overflow-x-auto")}> 
          <TabsList className={cn("mb-8 flex w-max min-w-max whitespace-nowrap", listClassName)}>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className={triggerClassName} aria-label={tab.name}>
                {icons?.[tab.id] ? <span aria-hidden className="mr-1 inline-flex">{icons[tab.id]}</span> : null}
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {rightActions ? <div className="flex gap-2 items-start">{rightActions}</div> : null}
      </div>

      {tabs.map((tab) => {
        const content = contents[tab.id];
        const isActive = value === tab.id;
        const node = typeof content === "function" ? (content as (a: boolean) => React.ReactNode)(isActive) : content;
        return (
          <TabsContent key={tab.id} value={tab.id} className={contentClassName}>
            {node}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
