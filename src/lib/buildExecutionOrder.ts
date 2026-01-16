// src/lib/buildExecutionOrder.ts
import type { CustomNodeData } from "@/pages/Builder";
import type { Node, Edge } from "@xyflow/react";

type Output = {
  id: number;
  order: number;
  api_type?: string;
  redirect_url?: string;
  poll_interval?: number;
  poll_max_attempts?: number;
};

function buildNodePayload(node: Node<CustomNodeData>, order: number): Output {
  const base: Output = {
    id: node.data.id,
    order,
  };

  // API type specific enrichment
  switch (node.data.type) {
    case "redirect":
      return {
        ...base,
        api_type: "redirects",
        redirect_url: node.data.redirect_url,
      };

    case "pooling":
      return {
        ...base,
        api_type: "pooling",
        poll_interval: node.data.poll_interval,
        poll_max_attempts: node.data.poll_max_attempts,
      };

    default:
      return base;
  }
}

export function buildExecutionOrder(nodes?: Node<CustomNodeData>[] | null, edges?: Edge[] | null): Output[] {
  // 🔒 Guard: execute only if flow is valid
  if (!nodes?.length) return [];

  const safeEdges = edges ?? [];

  // Map react-flow-id -> node
  const nodeMap = new Map<string, Node<CustomNodeData>>();
  nodes.forEach((n) => nodeMap.set(n.id, n));

  // Build adjacency list & in-degree map
  const adj = new Map<string, string[]>();
  const inDegree = new Map<string, number>();

  nodes.forEach((n) => {
    adj.set(n.id, []);
    inDegree.set(n.id, 0);
  });

  // 🔒 Defensive edge handling
  safeEdges.forEach(({ source, target }) => {
    if (!adj.has(source) || !inDegree.has(target)) return;

    adj.get(source)!.push(target);
    inDegree.set(target, inDegree.get(target)! + 1);
  });

  // Queue of nodes with no incoming edges
  const queue: Array<{ nodeId: string; order: number }> = [];

  inDegree.forEach((deg, nodeId) => {
    if (deg === 0) {
      queue.push({ nodeId, order: 1 });
    }
  });

  const result: Output[] = [];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const { nodeId, order } = queue.shift()!;

    if (visited.has(nodeId)) continue;
    visited.add(nodeId);

    const node = nodeMap.get(nodeId);
    if (!node?.data?.id) continue;

    result.push(buildNodePayload(node, order));

    for (const next of adj.get(nodeId) ?? []) {
      inDegree.set(next, inDegree.get(next)! - 1);

      if (inDegree.get(next) === 0) {
        queue.push({
          nodeId: next,
          order: order + 1,
        });
      }
    }
  }

  return result;
}
