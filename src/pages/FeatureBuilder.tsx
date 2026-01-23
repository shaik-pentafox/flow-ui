// src/pages/FeatureBuilder.tsx
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAPIList, getFeatureById, postFeature } from "@/services/auth.service";

import { Builder } from "./Builder";
import { buildExecutionOrder } from "@/lib/buildExecutionOrder";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";
import { buildFlowFromExecutionOrder } from "@/lib/buildFlowFromExecutionOrder";
import { useEffect } from "react";
import { is } from "zod/v4/locales";

type APIs = {
  id: string;
  order: string;
  api_type?: "redirects" | "pooling" | null;
  poll_interval?: number;
  poll_max_attempts?: number;
};

export type FeatureBuilderProps = {
  name: string;
  description?: string;
  apis: APIs[];
};

export function FeatureBuilder() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["api-lists"],
    queryFn: getAPIList,
    select: (data) =>
      data?.data
        .filter((item: any) => Boolean(item?.title))
        .map((item: any) => ({
          ...item,
          nodeType: "api", // ✅ add node type here
          type: "default",
          description: item.feature_description,
        })),
  });
  console.log(data, isLoading, error, "---apiListData--->");

  const { data: featData, isLoading: isFeatLoading } = useQuery({
    queryKey: ["flow-by-id", id],
    queryFn: () => getFeatureById(id as string),
    select: (data) => data?.data,
    enabled: !!id,
  });
  console.log(featData, isFeatLoading, id, "---featureFlowData--->");

  const displayTitle = featData?.name ?? "New Feature";
  const displayDescription = featData?.description ?? "Feature Description";
  const defaultFlows = featData?.features && buildFlowFromExecutionOrder({ data: featData?.features, type: "api" });
  console.log(defaultFlows, "---Default Feature Flow--->");

  const createFeature = useMutation({
    mutationFn: (body: any) => postFeature(body),
    onSuccess: () => {
      toast.success("Feature created successfully");
      navigate("/features");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create feature");
    },
  });

  const handleCreateFeature = (featureData: any) => {
    const ExecutionOrderItem = buildExecutionOrder(featureData.flow.nodes, featureData.flow.edges);

    const featureDataPayload = {
      name: featureData.title,
      desc: featureData.description,
      apis: ExecutionOrderItem,
    };

    console.log("Mutate Feature Data:", featureDataPayload);

    createFeature.mutate(featureDataPayload);
  };

  return (
    <Builder
      data={data}
      isLoading={isLoading || createFeature.isPending || isFeatLoading}
      error={error}
      title={displayTitle}
      description={displayDescription}
      onGenerate={handleCreateFeature}
      defaultFlow={defaultFlows}
    />
  );
}
