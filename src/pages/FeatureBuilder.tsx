// src/pages/FeatureBuilder.tsx
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAPIList, postFeature } from "@/services/auth.service";

import { Builder } from "./Builder";
import { buildExecutionOrder } from "@/lib/buildExecutionOrder";
import { toast } from "sonner";
import { useNavigate } from "react-router";

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

  console.log(data?.[0], isLoading, error);

  const createFeature = useMutation({
    mutationFn: (body: any) => postFeature(body),
    onSuccess: () => {
      toast.success("Feature created successfully");
      navigate("/features");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create feature");
    }
  });

  const handleCreateFeature = (featureData: any) => {
    const ExecutionOrderItem = buildExecutionOrder(featureData.flow.nodes, featureData.flow.edges);

    const featureDataPayload = {
      name: featureData.title,
      desc: featureData.description,
      apis: ExecutionOrderItem,
    };

    console.log("Feature Data:", featureDataPayload);

    createFeature.mutate(featureDataPayload);
  };

  return <Builder data={data} isLoading={isLoading || createFeature.isPending} error={error} title={"New Feature"} description={"Feature Description"} onGenerate={handleCreateFeature} />;
}