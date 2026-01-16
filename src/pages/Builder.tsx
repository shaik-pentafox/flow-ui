// src/pages/Builder.tsx
import { useState, useCallback, useMemo } from "react";
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, BackgroundVariant, Controls, MiniMap, useReactFlow } from "@xyflow/react";
import type { Node, Edge, NodeChange, EdgeChange, Connection, NodeTypes } from "@xyflow/react";
import { CustomNode } from "@/components/common/CustomNode";
import "@xyflow/react/dist/style.css";
import { useTheme } from "@/hooks/useTheme";
import { nanoid } from "nanoid";
import { SidebarProvider } from "@/components/ui/sidebar";
import { FlowSideBar } from "@/components/layouts/FlowSideBar";
import { FlowHeader } from "@/components/layouts/FlowHeader";
import type { DragEndEvent } from "@dnd-kit/core";
import { useDroppable, useSensor, useSensors, DndContext, PointerSensor, DragOverlay } from "@dnd-kit/core";
import { DynamicIcon } from "@/components/common/DynamicIcon";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import type { FeatureBuilderProps } from "./FeatureBuilder";
import { APINode } from "@/components/common/APINode";

// Type

export type customNodeTypes = "custom" | "api";

export type FeatureData = {
  title: string;
  description?: string;
  icon?: string | null;
  feature?: string;
  type?: customNodeTypes;
  [key: string]: any;
};

export type CustomNodeData = FeatureData & {
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  enableDuplicate?: boolean;
};

export type FlowNode = Node<CustomNodeData>;

export type CreateNodeParams = {
  data: FeatureData;
  position: { x: number; y: number };
  type: customNodeTypes;
  actions: {
    onDelete: (id: string) => void;
    onDuplicate: (id: string) => void;
    onUpdate: (id: string, partialData: any) => void;
  };
};

export type DeleteElements = (payload: { nodes?: (Partial<Node> & { id: Node["id"] })[]; edges?: (Partial<Edge> & { id: Edge["id"] })[] }) => Promise<{
  deletedNodes: Node[];
  deletedEdges: Edge[];
}>;

type DragData = {
  title: string;
  icon?: string | null;
  feature?: string;
  description?: string;
};

const createNode = ({ data, position, actions, type }: CreateNodeParams): FlowNode => ({
  id: nanoid(),
  type: type,
  position,
  data: {
    description: data.description || data.feature_description || "",
    ...data,
    ...actions,
    enableDuplicate: false,
  },
});

// Content
const initialNodes: FlowNode[] = [
  // { id: "n1", position: { x: 0, y: 0 }, data: { title: "Node 1" } },
  // { id: "n2", position: { x: 0, y: 0 }, data: { title: "Node 2" } },
  // { id: "n4", position: { x: 200, y: 100 }, data: { title: "Node 4" }, type: "custom" },
  // { id: "n5", position: { x: 200, y: 200 }, data: { title: "Node 5" }, type: "custom" },
];

const initialEdges: Edge[] = [
  // { id: "n4-n5", source: "n4", target: "n5" }
];

const edgeOptions = {
  type: "smoothstep",
  pathOptions: { offset: 5, borderRadius: 12 },
};

// Main Component
export function Builder({
  data,
  isLoading,
  error,
  title,
  description,
  onGenerate,
}: {
  data?: any[];
  isLoading?: boolean;
  error?: any;
  title?: string;
  description?: string;
  onGenerate?: (featureData: FeatureBuilderProps) => void;
}) {
  const [nodes, setNodes] = useState<Node<CustomNodeData>[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [activeDrag, setActiveDrag] = useState<DragData | null>(null);
  const { theme: colorMode } = useTheme();
  const { screenToFlowPosition } = useReactFlow();
  const { setNodeRef } = useDroppable({ id: "flow-canvas" });

  const nodeTypesMap = useMemo<NodeTypes>(
    () => ({
      custom: CustomNode,
      api: APINode,
    }),
    []
  );

  // DnD Kit Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // React Flow Handlers
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds) as Node<CustomNodeData>[]);
    },
    [setNodes]
  );

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge(connection, eds));
  }, []);

  const deleteElements: DeleteElements = useCallback(async ({ nodes: nodesToDelete = [], edges: edgesToDelete = [] }) => {
    let deletedNodes: Node[] = [];
    let deletedEdges: Edge[] = [];

    setNodes((prev) => {
      deletedNodes = prev.filter((n) => nodesToDelete.some((dn) => dn.id === n.id));
      return prev.filter((n) => !nodesToDelete.some((dn) => dn.id === n.id));
    });

    setEdges((prev) => {
      deletedEdges = prev.filter((e) => edgesToDelete.some((de) => de.id === e.id));
      return prev.filter((e) => !edgesToDelete.some((de) => de.id === e.id));
    });

    return { deletedNodes, deletedEdges };
  }, []);

  const onEdgeDoubleClick = useCallback(
    async (_event: React.MouseEvent, edge: Edge) => {
      await deleteElements({
        edges: [{ id: edge.id }],
      });
    },
    [deleteElements]
  );

  const deleteNode = useCallback(
    async (id: string) => {
      await deleteElements({
        nodes: [{ id }],
        edges: edges.filter((e) => e.source === id || e.target === id).map((e) => ({ id: e.id })),
      });
    },
    [deleteElements, edges]
  );

  // DUPLICATE NODE
  const duplicateNode = useCallback((nodeId: string) => {
    setNodes((nds) => {
      const node = nds.find((n) => n.id === nodeId);
      if (!node) return nds;

      return [
        ...nds,
        {
          ...node,
          id: nanoid(),
          position: {
            x: node.position.x + 40,
            y: node.position.y + 40,
          },
        },
      ];
    });
  }, []);

  const updateNodeData = useCallback((id: string, partialData: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                ...partialData,
              },
            }
          : node
      )
    );
  }, []);

  const addNode = useCallback(
    (data: FeatureData, position = { x: 100, y: 100 }) => {
      setNodes((nds) => [
        ...nds,
        createNode({
          data,
          position,
          type: data.nodeType || "custom",
          actions: {
            onDelete: deleteNode,
            onDuplicate: duplicateNode,
            onUpdate: updateNodeData,
          },
        }),
      ]);
    },
    [deleteNode, duplicateNode, updateNodeData]
  );

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, delta } = event;

      const data = active.data.current as FeatureData;
      if (!data) {
        console.log("No data found");
        return;
      }

      // Get the ReactFlow wrapper element
      const reactFlowWrapper = document.querySelector(".reactflow-wrapper");
      if (!reactFlowWrapper) {
        console.log("ReactFlow wrapper not found");
        return;
      }

      const reactFlowBounds = reactFlowWrapper.getBoundingClientRect();

      // Use the dragged element's rect instead of the cursor position
      // @ts-ignore - dnd-kit typings might not fully expose active.rect in all versions, or we check if it exists
      const activeRect = active.rect?.current?.translated;

      let dropX, dropY;

      if (activeRect) {
        // If we have the exact translated rect of the dragged item
        dropX = activeRect.left;
        dropY = activeRect.top;
      } else {
        // Fallback to cursor position (less accurate if not centered)
        const activatorEvent = event.activatorEvent as MouseEvent | PointerEvent;
        dropX = activatorEvent.clientX + delta.x;
        dropY = activatorEvent.clientY + delta.y;
      }

      console.log("Drop position:", { dropX, dropY });
      console.log("ReactFlow bounds:", reactFlowBounds);

      // Check if drop is within ReactFlow bounds
      // We check if the CENTER of the dropped item is inside? Or just top-left?
      // Let's use top-left for simplicity or maybe check intersection.
      // Existing logic used top-left.
      const isOverReactFlow = dropX >= reactFlowBounds.left && dropX <= reactFlowBounds.right && dropY >= reactFlowBounds.top && dropY <= reactFlowBounds.bottom;

      if (!isOverReactFlow) {
        console.log("Not dropped on ReactFlow canvas");
        return;
      }

      // Convert screen position to flow position
      const position = screenToFlowPosition({
        x: dropX,
        y: dropY,
      });

      console.log("Adding node at flow position:", position);
      addNode(data, position);
    },
    [addNode, screenToFlowPosition]
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={(event) => {
        setActiveDrag(event.active.data.current as DragData);
      }}
      onDragEnd={(event) => {
        setActiveDrag(null);
        onDragEnd(event);
      }}
      onDragCancel={() => setActiveDrag(null)}
    >
      <SidebarProvider defaultOpen={true} style={{ "--sidebar-width": "18rem" } as React.CSSProperties} enableSidebarKeyboardShortcut={false}>
        <ErrorBoundary fallbackMsg="Something went wrong in the Flow Sidebar.">
          <FlowSideBar onAddNode={addNode} data={data} isLoading={isLoading} error={error} />
        </ErrorBoundary>
        <main className="flex flex-col flex-1">
          <div className="flex flex-col m-2 ml-0">
            <FlowHeader
              title={title}
              description={description}
              isLoading={isLoading}
              flow={{
                nodes: nodes.length > 0 ? nodes : null,
                edges: edges.length > 0 ? edges : null,
              }}
              onSubmit={onGenerate}
            />
          </div>
          <div className="flex-1 reactflow-wrapper" ref={setNodeRef}>
            <ReactFlow
              nodes={nodes}
              // nodes={nodesWithActions}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypesMap}
              fitView
              colorMode={colorMode}
              defaultEdgeOptions={edgeOptions}
              onEdgeDoubleClick={onEdgeDoubleClick}
              maxZoom={1.3}
              panOnScroll={true}
              // panOnDrag={false}
              // selectionOnDrag={true}
              panOnDrag={!activeDrag}
              selectionOnDrag={!activeDrag}
            >
              <Controls className="rounded-sm overflow-hidden border shadow-md" />
              <MiniMap />
              <Background variant={BackgroundVariant.Dots} gap={12} size={1} bgColor="var(--background)" />
            </ReactFlow>
          </div>
        </main>
      </SidebarProvider>

      <DragOverlay dropAnimation={null}>
        {activeDrag && (
          <div className="bg-background border rounded-lg shadow-lg p-3 flex items-center gap-3 min-w-[200px]">
            <div className="flex-shrink-0">
              <DynamicIcon name={activeDrag.icon || "Webhook"} size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">{activeDrag.title}</div>
              {/* {activeDrag.description && <div className="text-xs text-muted-foreground truncate">{activeDrag.description}</div>} */}
            </div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
