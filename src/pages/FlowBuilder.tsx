// src/pages/FlowBuilder.tsx

import { useMutation, useQuery } from "@tanstack/react-query";
import { Builder } from "./Builder";
import { getFeatureList, getFlowById, postFlow } from "@/services/auth.service";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { buildExecutionOrder } from "@/lib/buildExecutionOrder";
import { buildFlowFromExecutionOrder } from "@/lib/buildFlowFromExecutionOrder";

export function FlowBuilder() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["feature-lists"],
    queryFn: getFeatureList,
    select: (data) => data?.data.map((item: any) => ({ ...item, title: item.name, description: item.description })) ?? [],
  });
  console.log(data, isLoading, error, "---apiListData--->");

  const { data: flowData, isLoading: isFlowLoading } = useQuery({
    queryKey: ["flow-by-id", id],
    queryFn: () => getFlowById(id as string),
    select: (data) => data?.data,
    enabled: !!id,
  });
  console.log(flowData, isFlowLoading, id, "---flowData--->");

  const displayTitle = flowData?.name ?? "New Flow";
  const displayDescription = flowData?.description ?? "Flow Description";
  const defaultFlows = flowData?.feature_flows && buildFlowFromExecutionOrder({ data: flowData?.feature_flows });

  console.log(defaultFlows, "---Default Flow--->");

  const createFlow = useMutation({
    mutationFn: (body: any) => postFlow(body),
    onSuccess: () => {
      toast.success("Flow created successfully");
      navigate("/flows");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create flow");
    },
  });

  const handleCreateFeature = (flowData: any) => {
    const ExecutionOrderItem = buildExecutionOrder(flowData.flow.nodes, flowData.flow.edges);

    const flowDataPayload = {
      name: flowData.title,
      desc: flowData.description,
      feature_flow: ExecutionOrderItem,
    };

    console.log("Mutate Flow Data:", flowDataPayload);

    createFlow.mutate(flowDataPayload);
  };

  return <Builder data={data} isLoading={isLoading || isFlowLoading} error={error} title={displayTitle} description={displayDescription} onGenerate={handleCreateFeature} defaultFlow={defaultFlows} />;
}
