// src/components/layouts/FlowSideBar.tsx
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader } from "@/components/ui/sidebar";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DynamicIcon } from "@/components/common/DynamicIcon";
import { Button } from "@/components/ui/button";
import { useDraggable } from "@dnd-kit/core";
// import { CSS } from "@dnd-kit/utilities";
import datas from "@/sample.json";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useMemo, useState } from "react";
import { Input } from "../ui/input";
import { Search } from "lucide-react";

type CardProps = {
  id: string;
  data: any;
  onAdd?: () => void;
};

function FlowSideBarCardSkeleton() {
  return (
    <Item variant="outline" className="my-1 p-2">
      <ItemMedia variant="icon" className="m-auto">
        <Skeleton className="h-6 w-6 rounded-md" />
      </ItemMedia>

      <ItemContent className="gap-1">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-32" />
      </ItemContent>

      <ItemActions>
        <Skeleton className="h-7 w-7 rounded-md" />
      </ItemActions>
    </Item>
  );
}

function Card({ id, data, onAdd }: CardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data: data,
  });

  const style = {
    // transform: CSS.Translate.toString(transform), // Prevent item from moving in the list
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Item ref={setNodeRef} style={style} {...listeners} {...attributes} variant="outline" className="cursor-grab active:cursor-grabbing my-1 p-2 hover:bg-accent/50 hover:shadow-md transition-shadow">
      <ItemMedia variant="icon" className="m-auto cursor-grab active:cursor-grabbing">
        <DynamicIcon name={data.icon || "Webhook"} />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="text-xs">{data.title}</ItemTitle>
        <ItemDescription className="text-[12px]">{data.description || data.feature_description}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button size="icon" variant="outline" className="scale-80" onClick={onAdd}>
          <DynamicIcon name="Plus" />
        </Button>
      </ItemActions>
    </Item>
  );
}

export function FlowSideBar({ data = [], isLoading, error, onAddNode }: { data: any[] | undefined; isLoading?: boolean; error?: any; onAddNode: (data: any, position: { x: number; y: number }) => void }) {
  const [search, setSearch] = useState("");


  const groupedData = useMemo(() => {
    return data.reduce((acc: Record<string, any[]>, item) => {
      if (!item.category) return acc; // ⛔ skip uncategorized
      acc[item.category] ??= [];
      acc[item.category].push(item);
      return acc;
    }, {});
  }, [data]);

  const searchedGroupedData = useMemo(() => {
    if (!search.trim()) return groupedData;

    const q = search.toLowerCase();

    return Object.entries(groupedData).reduce((acc: Record<string, any[]>, [category, items]) => {
      acc[category] = items.filter((item) => item.title?.toLowerCase().includes(q) || item.feature_description?.toLowerCase().includes(q));
      return acc;
    }, {});
  }, [groupedData, search]);

  const categoryTabs = Object.keys(searchedGroupedData);
  const tabs = categoryTabs.length ? ["All", ...categoryTabs] : ["All"];

  const allItems = useMemo(() => {
    if (!search.trim()) return data;

    const q = search.toLowerCase();
    return data.filter((item) => item.title?.toLowerCase().includes(q) || item.feature_description?.toLowerCase().includes(q));
  }, [data, search]);

  const renderCards = (items: any[]) => {
    if (isLoading) {
      return Array.from({ length: 6 }).map((_, i) => <FlowSideBarCardSkeleton key={i} />);
    }

    if (!items.length) {
      return <div className="text-xs text-muted-foreground text-center py-4">{error || error.message || "No items"}</div>;
    }

    return items.map((item) => <Card key={item.id} id={`feature-${item.id}`} data={item} onAdd={() => onAddNode(item, { x: 120, y: 120 })} />);
  };

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} rightSection={<Search className="h-4 w-4 text-muted-foreground" />} />
      </SidebarHeader>
      <SidebarContent className="overflow-hidden h-full">
        <SidebarGroup className="h-full flex flex-col">
          <Tabs defaultValue="All" className="h-full flex">
            {/* FIXED TABS HEADER */}
            <TabsList className="h-9 p-0 px-1 !scrollbar-hide">
              {tabs.map((tab) => (
                <TabsTrigger key={tab} value={tab} className="h-6 ">
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* SCROLLABLE CONTENT */}
            {/* <div className="flex-1 overflow-hidden"> */}
            <ScrollArea className="h-full pr-2 -mr-2 overflow-x-hidden">
              {/* ALL TAB */}
              <TabsContent value="All" className="mt-2">
                {renderCards(allItems)}
              </TabsContent>

              {/* CATEGORY TABS */}
              {Object.entries(searchedGroupedData).map(([category, items]) => (
                <TabsContent key={category} value={category} className="mt-2">
                  {renderCards(items)}
                </TabsContent>
              ))}
            </ScrollArea>
            {/* </div> */}
          </Tabs>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

// // src/components/layouts/FlowSideBar.tsx
// import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader } from "@/components/ui/sidebar";
// import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { DynamicIcon } from "@/components/common/DynamicIcon";
// import { Button } from "@/components/ui/button";
// import { useDraggable } from "@dnd-kit/core";
// // import { CSS } from "@dnd-kit/utilities";
// import datas from "@/sample.json";
// import { Skeleton } from "@/components/ui/skeleton";

// type CardProps = {
//   id: string;
//   data: any;
//   onAdd?: () => void;
// };

// function FlowSideBarCardSkeleton() {
//   return (
//     <Item variant="outline" className="my-1 p-2">
//       <ItemMedia variant="icon" className="m-auto">
//         <Skeleton className="h-6 w-6 rounded-md" />
//       </ItemMedia>

//       <ItemContent className="gap-1">
//         <Skeleton className="h-3 w-24" />
//         <Skeleton className="h-3 w-32" />
//       </ItemContent>

//       <ItemActions>
//         <Skeleton className="h-7 w-7 rounded-md" />
//       </ItemActions>
//     </Item>
//   );
// }

// function Card({ id, data, onAdd }: CardProps) {
//   const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
//     id,
//     data: data,
//   });

//   const style = {
//     // transform: CSS.Translate.toString(transform), // Prevent item from moving in the list
//     opacity: isDragging ? 0.5 : 1,
//   };

//   return (
//     <Item ref={setNodeRef} style={style} {...listeners} {...attributes} variant="outline" className="my-1 p-2 hover:bg-accent/50 hover:shadow-md transition-shadow">
//       <ItemMedia variant="icon" className="m-auto cursor-grab active:cursor-grabbing">
//         <DynamicIcon name={data.icon || "Webhook"} />
//       </ItemMedia>
//       <ItemContent>
//         <ItemTitle className="text-xs">{data.title}</ItemTitle>
//         <ItemDescription className="text-[12px]">{data.feature_description}</ItemDescription>
//       </ItemContent>
//       <ItemActions>
//         <Button size="icon" variant="outline" className="scale-80" onClick={onAdd}>
//           <DynamicIcon name="Plus" />
//         </Button>
//       </ItemActions>
//     </Item>
//   );
// }

// type GroupedData = Record<string, any[]>;

// export function FlowSideBar({ data, isLoading, error, onAddNode }: { data: any; isLoading?: boolean; error?: any; onAddNode: (data: any, position: { x: number; y: number }) => void }) {
//   const filteredData = data && data.length > 0 ? data : data.filter((item: any) => item.title);

//   const groupedData: GroupedData = filteredData.reduce((acc, item) => {
//     const category = item.category || "Uncategorized";

//     if (!acc[category]) {
//       acc[category] = [];
//     }

//     acc[category].push(item);
//     return acc;
//   }, {} as GroupedData);

//   return (
//     <Sidebar collapsible="icon" variant="floating">
//       {/* <SidebarHeader>
//         <div className="px-4 py-2 font-medium text-lg text-center border rounded-md">Features</div>
//       </SidebarHeader> */}
//       <SidebarContent className="overflow-hidden">
//         <ScrollArea className="h-full pr-2 touch-pan-y overflow-x-hidden">
//           <SidebarGroup>
//             {isLoading
//               ? Array.from({ length: 6 }).map((_, i) => <FlowSideBarCardSkeleton key={i} />)
//               : data.filter((item: any) => item.title).map((item: any) => <Card key={item.id} id={`feature-${item.id}`} data={item} onAdd={() => onAddNode(item, { x: 120, y: 120 })} />)}
//           </SidebarGroup>
//         </ScrollArea>
//       </SidebarContent>
//     </Sidebar>
//   );
// }
