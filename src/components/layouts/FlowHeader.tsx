// src/components/layouts/FlowHeader.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Item, ItemActions, ItemContent, ItemDescription } from "../ui/item";
import { z } from "zod";
import type { Edge, Node } from "@xyflow/react";
import type { CustomNodeData } from "@/pages/FlowBuilder";
import { buildExecutionOrder } from "@/lib/buildExecutionOrder";

export const flowHeaderSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title is too long"),
  description: z.string().max(300, "Description is too long"),
});

export type ExecutionOrderItem = {
  id: number;
  order: number;
};

export type FlowHeaderFormValues = z.infer<typeof flowHeaderSchema>;

export type FlowSubmitPayload = FlowHeaderFormValues & {
  flow?: {
    nodes: Node<CustomNodeData>[] | null;
    edges: Edge[] | null;
  };
  executionOrder?: ExecutionOrderItem[];
};

type FlowHeaderProps = {
  title?: string;
  description?: string;
  flow?: { nodes: Node<CustomNodeData>[] | null; edges: Edge[] | null };
  onSubmit?: (data: FlowSubmitPayload) => void;
};

export function FlowHeader({ title, description, flow, onSubmit }: FlowHeaderProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FlowHeaderFormValues>({
    resolver: zodResolver(flowHeaderSchema),
    defaultValues: {
      title: title,
      description: description,
    },
  });

  const executionOrder = buildExecutionOrder(flow?.nodes || [], flow?.edges || []);

   const handleFormSubmit = (data: FlowHeaderFormValues) => {
      onSubmit?.({
        ...data,
        flow,
        executionOrder,
      });
    };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Item className="w-full bg-primary-foreground" variant="outline">
        <ItemContent className="gap-1">
          {/* Title */}
          <ItemDescription>
            <Input
              placeholder="Title.."
              {...register("title")}
              className="h-7 w-1/2 !bg-transparent border-1 border-transparent hover:border-ring transition-border !text-lg !px-2 !py-0 font-medium text-foreground !shadow-none !ring-0 !ring-offset-0"
            />
            {errors.title && <p className="text-xs text-destructive mt-1">{errors.title.message}</p>}
          </ItemDescription>

          {/* Description */}
          <ItemDescription>
            <Input
              placeholder="Description.."
              {...register("description")}
              className="h-7 !bg-transparent border-1 border-transparent hover:border-ring transition-border !px-2 !py-0 text-muted-foreground !shadow-none !ring-0 !ring-offset-0"
            />
            {errors.description && <p className="text-xs text-destructive mt-1">{errors.description.message}</p>}
          </ItemDescription>
        </ItemContent>

        <ItemActions>
          <Button type="submit" variant="outline" size="sm">
            Generated Flow
          </Button>
        </ItemActions>
      </Item>
    </form>
  );
}
