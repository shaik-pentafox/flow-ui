// src/components/common/CustomNode.tsx
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { cn } from "@/lib/utils";
import { ButtonGroup } from "../ui/button-group";
import { Button } from "../ui/button";
import { Copy, Trash } from "lucide-react";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "../ui/item";
import { DynamicIcon } from "./DynamicIcon";
import type { FlowNode } from "@/pages/Builder";
import { Badge } from "../ui/badge";

type CardProps = {
  title: string;
  description?: string;
  icon?: string | null;
  APICount?: number;
};

function Card({ title, description, icon, APICount }: CardProps) {
  return (
    <Item className="p-0">
      <ItemMedia variant="icon" className="m-auto">
        <DynamicIcon name={icon || "Webhook"} />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="text-xs ">
          {title}
          <Badge variant="outline" className="h-5 min-w-5 rounded-sm px-1 text-[10px] flex items-center justify-center">
            {APICount}
          </Badge>
        </ItemTitle>
        <ItemDescription className="text-[12px]">{description}</ItemDescription>
      </ItemContent>
    </Item>
  );
}

export function CustomNode({ id, data, selected }: NodeProps<FlowNode>) {
  return (
    <div
      className={cn(
        "relative bg-node text-node-foreground flex flex-col rounded border p-2 min-w-[120px] max-w-[300px] items-center gap-2 scale-90",
        "hover:shadow-sm shadow-node-accent-foreground/8 transition-shadow",
        selected && "border-primary/30"
      )}
    >
      <Handle type="target" position={Position.Top} />
      <ButtonGroup className="absolute -top-4.5 -right-1 flex scale-45">
        {data?.enableDuplicate && (
          <Button variant="secondary" className="p-0 " onClick={() => data?.onDuplicate?.(id)}>
            {" "}
            <Copy size={10} />{" "}
          </Button>
        )}
        <Button variant="secondary" className="p-0 " onClick={() => data?.onDelete?.(id)}>
          <Trash size={10} className="text-destructive" />{" "}
        </Button>
      </ButtonGroup>

      <Card title={data?.title} description={data?.description} icon={data?.icon} APICount={data?.features?.length} />
      <Handle type="source" position={Position.Bottom} color="red" />
    </div>
  );
}
