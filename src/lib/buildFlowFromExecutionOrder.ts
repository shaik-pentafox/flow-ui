import { nanoid } from "nanoid";
import type { Edge } from "@xyflow/react";
import type { CustomNodeData, FlowNode } from "./Builder";

type ApiGroup = {
  id: number;
  name: string;
  order_in_flow: number;
  features: ApiFeature[];
  description?: string
  feature_description?: string;
  api_type?: "default" | "redirects" | "pooling";
};

type ApiFeature = {
  id: number;
  title: string;
  feature: string;
  feature_description?: string;
  icon?: string;
  execution_order: number;
};

type BuildFlowParams = {
  data: ApiGroup[];
  type?: "api" | "custom"
};

export function buildFlowFromExecutionOrder({ data, type = "custom" }: BuildFlowParams): { nodes: FlowNode[]; edges: Edge[] } {
  const nodes: FlowNode[] = [];
  const edges: Edge[] = [];

  let prevNodeId: string | null = null;

  const sortedGroups = [...data].sort((a, b) => a.order_in_flow - b.order_in_flow);

  sortedGroups.forEach((group, groupIndex) => {
    // const sortedFeatures = [...group.features].sort((a, b) => a.execution_order - b.execution_order);

    // sortedFeatures.forEach((feature, featureIndex) => {
      const nodeId = nanoid();

      const position = {
        y: groupIndex * 100,
        x: 0,
      };

      nodes.push({
        id: nodeId,
        type,
        position,
        data: {
          title: group.name,
          description: group.feature_description || group.description,
          type: group.api_type,
          ...group
        },
      });


      // Edge from previous node
      if (prevNodeId) {
        edges.push({
          id: `${prevNodeId}-${nodeId}`,
          source: prevNodeId,
          target: nodeId,
          type: "smoothstep",
        });
      }

      prevNodeId = nodeId;
    // });
  });

  return { nodes, edges };
}
