// src/pages/Flow.tsx
import { Group } from "@/components/common/Group";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { activateFlow, deleteFlowById, getFlowList } from "@/services/auth.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DynamicFormBuilder } from "@/components/common/DynamicFormBuilder";
import { toast } from "sonner";
import { DynamicIcon } from "@/components/common/DynamicIcon";
import { useState } from "react";
import { FlowListCard } from "@/components/common/FlowListCard";

function FlowSkeletonGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-lg border p-4">
          <Skeleton className="mb-3 h-5 w-3/4" />
          <Skeleton className="mb-2 h-4 w-full" />
          <Skeleton className="mb-2 h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}

const fields = [
  {
    id: 78,
    field: "name",
    label: "Name",
    type: "string",
    interface: "TEXT",
    is_required: true,
  },
  {
    id: 79,
    field: "identifier",
    label: "Mobile Number",
    type: "string",
    interface: "NUMERIC",
    is_required: true,
    regex: "^[0-9]{10}$",
    maxLength: 10,
  },
];

export function Flow() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedFlow, setSelectedFlow] = useState<any>(null); // Controls Input Dialog
  const [activationResult, setActivationResult] = useState<any>(null); // Controls Result Dialog
  const [isResultOpen, setIsResultOpen] = useState(false); // Visibility of Result Dialog

  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["flow-lists"],
    queryFn: getFlowList,
    select: (data) => data?.data ?? [],
  });

  const activateFlowMutate = useMutation({
    mutationFn: (body: any) => activateFlow(body),
    onSuccess: (response: any) => {
      toast.success("Flow activated successfully");
      setSelectedFlow(null);

      // Set the response data and Open Result Dialog
      setActivationResult(response?.data);
      setIsResultOpen(true);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create flow");
    },
  });

  const deleteFlowMutate = useMutation({
    mutationFn: (flowId: string) => deleteFlowById(flowId),
    onSuccess: (response: any) => {
      toast.success(response?.message || "Flow deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["flow-lists"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete flow");
    },
  });

  console.log(activateFlowMutate?.data?.data, "react--->");

  const handleActivateFlow = (id: string, flowData: any) => {
    if (!id) return;
    const payload = {
      flow_id: id,
      end_customer_details: {
        name: flowData.name,
        identifier: flowData.identifier,
      },
    };
    console.log(payload);
    activateFlowMutate.mutate(payload);
  };

  const handleDeleteFlow = (flowId: string) => {
    console.log(flowId);
    deleteFlowMutate.mutate(flowId);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div>
      {/* Header */}
      <Group position="apart" className="mb-4">
        <h2 className="text-xl font-semibold tracking-tight text-sidebar-accent-foreground">Flow</h2>

        <Button variant="secondary" className="w-full sm:w-auto" onClick={() => navigate("/flow-builder")}>
          Flow Builder
        </Button>
      </Group>

      {/* Loading */}
      {isLoading && <FlowSkeletonGrid />}

      {/* Error */}
      {error && <p className="text-sm text-destructive text-destructive text-center pb-2">Failed to load flows.</p>}

      {/* Empty state */}
      {!isLoading && data.length === 0 && <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">No flows available.</div>}

      {/* Grid */}
      {data.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.map((item: any) => (
            <Card key={item.id} className="hover:bg-accent/50 hover:shadow-md transition-shadow pb-4 justify-between gap-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  <span className="truncate">{item.name}</span>
                  <Badge variant="secondary" className="shrink-0 ml-2 bg-[var(--brand-200)]">
                    {item?.feature_flows.length}
                  </Badge>
                </CardTitle>

                <CardDescription className="line-clamp-3 break-words">{item.description || "No description provided."}</CardDescription>
              </CardHeader>

              {/* Optional footer/actions */}
              <CardFooter className="justify-between">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => navigate(`/flow-builder/${item.id}`)}>Update</DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" disabled={deleteFlowMutate.isPending} onClick={() => handleDeleteFlow(item.id)}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="secondary" size="sm" onClick={() => setSelectedFlow(item)}>
                  Initialize
                </Button>
              </CardFooter>
            </Card>
          ))}
          {data.map((item: any) => (
            <FlowListCard
              key={item.id}
              item={item}
              isActivating={activateFlowMutate.isPending}
              activationResult={activateFlowMutate.data?.data}
              onActivate={handleActivateFlow}
              onUpdate={(id) => navigate(`/flow-builder/${id}`)}
              onDelete={(id) => deleteFlowMutate.mutate(id)}
              fields={fields}
            />
          ))}
        </div>
      )}

      {/* Input Dialog */}
      <Dialog open={!!selectedFlow} onOpenChange={(open) => !open && setSelectedFlow(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Initialize Flow</DialogTitle>
            <DialogDescription>Provide customer details to initialize this flow.</DialogDescription>
          </DialogHeader>
          <DynamicFormBuilder fields={fields} isLoading={activateFlowMutate.isPending} onSubmit={handleActivateFlow} btnVariants="outline" btnClassName="flex justify-end" />
        </DialogContent>
      </Dialog>

      <Dialog open={false} onOpenChange={setIsResultOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Flow Activated</DialogTitle>
            <DialogDescription>Get the redirect URL or copy the result.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 pt-4">
            {/* Example: Displaying a Redirect URL if it exists */}
            {activationResult?.redirect_url && (
              <div className="flex gap-2 justify-center">
                <Button type="button" className="px-3" variant="outline" onClick={() => window.open(activationResult?.redirect_url, "_blank", "noopener,noreferrer")}>
                  <DynamicIcon name="ExternalLink" /> Redirect
                </Button>
                <Button type="button" className="px-3" variant="secondary" onClick={() => copyToClipboard(activationResult?.redirect_url)}>
                  <DynamicIcon name="Copy" /> Copy
                </Button>
              </div>
            )}

            {/* Displaying Raw JSON Data (or format as needed) */}
            {/* <div className="bg-muted p-4 rounded-md text-xs font-mono overflow-auto max-h-[200px]">
              <pre>{JSON.stringify(activationResult, null, 2)}</pre>
            </div> */}
          </div>

          <DialogFooter className="sm:justify-end">
            <Button type="button" variant="secondary" onClick={() => setIsResultOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
