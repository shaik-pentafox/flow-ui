import type { CustomNodeData } from "@/pages/FlowBuilder";
import type { Node, Edge } from "@xyflow/react";

type Output = {
  id: number;
  order: number;
};

export function buildExecutionOrder(nodes: Node<CustomNodeData>[], edges: Edge[]): Output[] {
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

  edges.forEach(({ source, target }) => {
    adj.get(source)!.push(target);
    inDegree.set(target, (inDegree.get(target) || 0) + 1);
  });

  // Queue of [nodeId, order]
  const queue: Array<{ nodeId: string; order: number }> = [];

  // Start with root nodes (no incoming edges)
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
    if (!node) continue;

    result.push({
      id: node.data.id,
      order,
    });

    for (const next of adj.get(nodeId) || []) {
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
