// src/pages/FlowBuilder.tsx

import { useQuery } from "@tanstack/react-query";
import { Builder } from "./Builder";
import { getFeatureList } from "@/services/auth.service";

export function FlowBuilder() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["flow-lists"],
    queryFn: getFeatureList,
    select: (data) => data?.data.map((item: any) => ({ ...item, title: item.name, description: item.description })) ?? [],
  });
  console.log(data, isLoading, error);
  return <Builder data={data} isLoading={isLoading} error={error} title={"New Flow"} description={"Flow Description"} />;
}
