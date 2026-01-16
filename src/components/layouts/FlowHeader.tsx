// src/components/layouts/FlowHeader.tsx
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Item, ItemActions, ItemContent, ItemDescription } from "@/components/ui/item";

import type { Edge, Node } from "@xyflow/react";
import type { CustomNodeData } from "@/pages/Builder";
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

type FlowHeaderProps = {
  title?: string;
  description?: string;
  isLoading?: boolean;
  flow?: { nodes: Node<CustomNodeData>[] | null; edges: Edge[] | null };
  onSubmit?: (data: any) => void;
};

export function FlowHeader({ title, description, isLoading, flow, onSubmit }: FlowHeaderProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FlowHeaderFormValues>({
    resolver: zodResolver(flowHeaderSchema),
    defaultValues: {
      title,
      description,
    },
  });

  const handleFormSubmit = (data: FlowHeaderFormValues) => {
    onSubmit?.({
      ...data,
      flow,
    });
  };

  if (isLoading) {
    return (
      <Item className="w-full bg-primary-foreground" variant="outline">
        <ItemContent className="gap-2">
          <Skeleton className="h-7 w-1/2" />
          <Skeleton className="h-6 w-3/4" />
        </ItemContent>
        <ItemActions>
          <Skeleton className="h-8 w-28" />
        </ItemActions>
      </Item>
    );
  }

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
          {flow?.nodes && (
            <Button type="submit" variant="outline" size="sm">
              Generated Flow
            </Button>
          )}
        </ItemActions>
      </Item>
    </form>
  );
}
