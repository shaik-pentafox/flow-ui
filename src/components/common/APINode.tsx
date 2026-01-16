// src/components/common/APINode.tsx
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { cn } from "@/lib/utils";
import { ButtonGroup } from "../ui/button-group";
import { Button } from "../ui/button";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "../ui/item";
import { DynamicIcon } from "./DynamicIcon";
import type { FlowNode } from "@/pages/Builder";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState } from "react";

type CardProps = {
  title: string;
  description?: string;
  icon?: string | null;
  data?: any;
  nodeId: string;
};

function Card({ title, description, icon, data, nodeId }: CardProps) {
  const [activeTab, setActiveTab] = useState(data?.type || "default");
  const [pollInterval, setPollInterval] = useState(data?.poll_interval ?? 2);
  const [pollMaxAttempts, setPollMaxAttempts] = useState(data?.poll_max_attempts ?? 30);
  const [redirectUrl, setRedirectUrl] = useState(data?.redirect_url ?? "");
  const [open, setOpen] = useState(false);

  const handleTabChange = (value: string) => {
    setActiveTab(value);

    const updatedData = {
      ...data,
      type: value,
      ...(value === "pooling" && {
        poll_interval: pollInterval,
        poll_max_attempts: pollMaxAttempts,
      }),
      ...(value === "redirect" && {
        redirect_url: redirectUrl,
      }),
    };

    console.log(data)

    data?.onUpdate?.(nodeId, updatedData);
  };

  const handleRedirectUrlChange = (value: string) => {
    setRedirectUrl(value);
    data?.onUpdate?.(nodeId, {
      ...data,
      type: "redirect",
      redirect_url: value,
    });
  };

  const handlePollIntervalChange = (value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      setPollInterval(numValue);
      data?.onUpdate?.(nodeId, {
        ...data,
        type: "pooling",
        poll_interval: numValue,
        poll_max_attempts: pollMaxAttempts,
      });
    }
  };

  const handlePollMaxAttemptsChange = (value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      setPollMaxAttempts(numValue);
      data?.onUpdate?.(nodeId, {
        ...data,
        type: "pooling",
        poll_interval: pollInterval,
        poll_max_attempts: numValue,
      });
    }
  };

  console.log(data)

  return (
    <Item className="p-0">
      {icon && (
        <ItemMedia variant="icon" className="m-auto">
          <DynamicIcon name={icon} />
        </ItemMedia>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Badge variant="outline" className="absolute right-1 top-1.5 scale-75 cursor-pointer hover:bg-accent">
            {activeTab}
          </Badge>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Response Configuration</h3>
              <p className="text-sm text-muted-foreground">Configure how this API node handles responses</p>
            </div>

            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="default">Default</TabsTrigger>
                <TabsTrigger value="redirect">Redirect</TabsTrigger>
                <TabsTrigger value="pooling">pooling</TabsTrigger>
              </TabsList>

              <TabsContent value="default" className="space-y-4 pt-4">
                <div className="rounded-lg border p-4">
                  <h4 className="font-medium mb-2">Default Behavior</h4>
                  <p className="text-sm text-muted-foreground">The API will execute and return results immediately without any special handling.</p>
                </div>
              </TabsContent>

              <TabsContent value="redirect" className="space-y-4 pt-4">
                <div className="rounded-lg border p-4 space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Redirect Response</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      The API will return a redirect URL that the client should navigate to. Useful for payment gateways, OAuth flows, and external authentication.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="redirect-url" className="text-sm font-medium">
                      Redirect URL
                    </Label>
                    <Input id="redirect-url" type="url" placeholder="https://example.com/callback" value={redirectUrl} onChange={(e) => handleRedirectUrlChange(e.target.value)} className="w-full" />
                    <p className="text-xs text-muted-foreground">The URL where the user will be redirected after the API call</p>
                  </div>

                  {redirectUrl && (
                    <div className="rounded-md bg-muted p-3">
                      <p className="text-xs text-muted-foreground">
                        Redirect to: <span className="font-medium text-foreground break-all">{redirectUrl}</span>
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="pooling" className="space-y-4 pt-4">
                <div className="rounded-lg border p-4 space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">pooling Configuration</h4>
                    <p className="text-sm text-muted-foreground mb-4">The API will be polled at regular intervals until a final result is received or the maximum attempts are reached.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="poll-interval" className="text-sm font-medium">
                      Poll Interval (seconds)
                    </Label>
                    <Input id="poll-interval" type="number" min="1" value={pollInterval} onChange={(e) => handlePollIntervalChange(e.target.value)} className="w-full" />
                    <p className="text-xs text-muted-foreground">Time to wait between each pooling attempt (default: 2 seconds)</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="poll-max-attempts" className="text-sm font-medium">
                      Maximum Attempts
                    </Label>
                    <Input id="poll-max-attempts" type="number" min="1" value={pollMaxAttempts} onChange={(e) => handlePollMaxAttemptsChange(e.target.value)} className="w-full" />
                    <p className="text-xs text-muted-foreground">Maximum number of pooling attempts before timeout (default: 30 attempts)</p>
                  </div>

                  <div className="rounded-md bg-muted p-3">
                    <p className="text-xs text-muted-foreground">
                      Total timeout: <span className="font-medium text-foreground">{pollInterval * pollMaxAttempts} seconds</span>
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      <ItemContent>
        <ItemTitle className="text-xs">{title}</ItemTitle>
        <ItemDescription className="text-[11px]">{description}</ItemDescription>
      </ItemContent>
    </Item>
  );
}

export function APINode({ id, data, selected }: NodeProps<FlowNode>) {
  return (
    <div
      className={cn(
        "relative bg-node text-node-foreground flex flex-col rounded border p-2 min-w-[120px] max-w-[300px] items-center gap-2 scale-90",
        "hover:shadow-sm shadow-node-accent-foreground/8 transition-shadow",
        selected && "border-primary/30"
      )}
    >
      <Handle type="target" position={Position.Top} />
      <ButtonGroup className="absolute -top-4.5 -right-1 flex scale-45">
        {data?.enableDuplicate && (
          <Button variant="secondary" className="p-0" onClick={() => data?.onDuplicate?.(id)}>
            <DynamicIcon name="Copy" />
          </Button>
        )}
        <Button variant="secondary" className="p-0" onClick={() => data?.onDelete?.(id)}>
          <DynamicIcon name="Trash" className="text-destructive" />
        </Button>
      </ButtonGroup>

      <Card title={data?.title} description={data?.description} icon={data?.icon} data={data} nodeId={id} />

      <Handle type="source" position={Position.Bottom} color="red" />
    </div>
  );
}