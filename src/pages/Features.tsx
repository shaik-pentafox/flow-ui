// src/pages/Features.tsx
import { Group } from "@/components/common/Group";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
    queryKey: ["feature-lists"],
    queryFn: getFeatureList,
    select: (data) => data?.data ?? [],
  });

  return (
    <div>
      {/* Header */}
      <Group position="apart" className="mb-4">
        <h2 className="text-xl font-semibold tracking-tight text-sidebar-accent-foreground">Features</h2>

        <Button variant="secondary" className="w-full sm:w-auto" onClick={() => navigate("/feature-builder")}>
          Feature Builder
        </Button>
      </Group>

      {/* Loading */}
      {isLoading && <FeatureSkeletonGrid />}

      {/* Error */}
      {error && <p className="text-sm text-destructive text-destructive text-center pb-2">Failed to load features.</p>}

      {/* Empty state */}
      {!isLoading && data.length === 0 && <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">No features available.</div>}

      {/* Grid */}
      {data.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.map((item: any) => (
            <Card key={item.id} className="hover:bg-accent/50 hover:shadow-md transition-shadow pb-4 justify-between gap-2">
              <CardHeader className="">
                <CardTitle className="flex justify-between items-center gap-2 text-base w-full min-w-0">
                  <span className="truncate min-w-0">{item.name}</span>
                  <Badge variant="secondary" className="shrink-0 ml-2 bg-[var(--brand-200)]">
                    {item?.features.length}
                  </Badge>
                </CardTitle>

                <CardDescription className="line-clamp-3 break-words overflow-hidden">{item.description || "No description provided."}</CardDescription>
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
                    <DropdownMenuItem onClick={() => navigate(`/feature-builder/${item.id}`)}>Update</DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" disabled>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
