// src/pages/Flow.tsx
import { Group } from "@/components/common/Group";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getFeatureList } from "@/services/auth.service";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

function FeatureSkeletonGrid() {
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

export function Features() {
  const navigate = useNavigate();

  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["flow-lists"],
    queryFn: getFeatureList,
    select: (data) => data?.data ?? [],
  });

  return (
    <div>
      {/* Header */}
      <Group position="apart" className="mb-4">
        <h2 className="text-xl font-semibold tracking-tight">Features</h2>

        <Button variant="secondary" className="w-full sm:w-auto" onClick={() => navigate("/feature-builder")}>
          Feature Builder
        </Button>
      </Group>

      {/* Loading */}
      {isLoading && <FeatureSkeletonGrid />}

      {/* Error */}
      {error && <p className="text-sm text-destructive">Failed to load features.</p>}

      {/* Empty state */}
      {!isLoading && data.length === 0 && <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">No features available.</div>}

      {/* Grid */}
      {data.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.map((item: any) => (
            <Card key={item.id} className="transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <span className="truncate">{item.name}</span>

                  <Badge variant="secondary" className="ml-auto">
                    {item?.features.length}
                  </Badge>
                </CardTitle>

                <CardDescription className="line-clamp-3">{item.description || "No description provided."}</CardDescription>
              </CardHeader>

              {/* Optional footer/actions */}
              {/* <CardContent className="pt-0">
                <Button variant="ghost" size="sm">
                  Open
                </Button>
              </CardContent> */}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
