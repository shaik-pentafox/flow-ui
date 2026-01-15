// src/components/layouts/FlowSideBar.tsx
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader } from "@/components/ui/sidebar";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "../ui/item";
import { ScrollArea } from "../ui/scroll-area";
import { DynamicIcon } from "../common/DynamicIcon";
import { Button } from "../ui/button";
import {  useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import data from "@/sample.json";

type CardProps = {
  id: string;
  data: any;
  onAdd?: () => void;
};

function Card({ id, data, onAdd }: CardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data: data,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Item ref={setNodeRef} style={style} {...listeners} {...attributes} variant="outline" className="my-1 p-2 hover:bg-accent/50 hover:shadow-md transition-shadow">
      <ItemMedia variant="icon" className="m-auto cursor-grab active:cursor-grabbing">
        <DynamicIcon name={data.icon || "Webhook"} />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="text-xs">{data.title}</ItemTitle>
        <ItemDescription className="text-[12px]">{data.feature_description}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button size="icon" variant="outline" className="scale-80" onClick={onAdd}>
          <DynamicIcon name="Plus" />
        </Button>
      </ItemActions>
    </Item>
  );
}


export function FlowSideBar({ onAddNode }: { onAddNode: (data: any, position: { x: number; y: number }) => void }) {
  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <div className="px-4 py-2 font-medium text-lg text-center border rounded-md">Features</div>
      </SidebarHeader>
      <SidebarContent className="overflow-hidden">
        <ScrollArea className="h-full pr-2 touch-pan-y overflow-x-hidden">
          <SidebarGroup>
            {data.map((item) => (
              <Card key={item.id} id={`feature-${item.id}`} data={item} onAdd={() => onAddNode(item, { x: 120, y: 120 })} />
            ))}
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  );
}
