// "use client";

import { useEffect, useState } from "react";
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogTitle,
  MorphingDialogSubtitle,
  MorphingDialogDescription,
  MorphingDialogClose,
  MorphingDialogContainer,
} from "@/components/motion-primitives/morphing-dialog";

import { TransitionPanel } from "@/components/motion-primitives/transition-panel";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PlusIcon } from "lucide-react";
import { DynamicFormBuilder } from "./DynamicFormBuilder";
import { DynamicIcon } from "./DynamicIcon";

type FlowListCardProps = {
  item: {
    id: string;
    name: string;
    description?: string;
    feature_flows: any[];
  };
  onUpdate: (id: string) => void;
  onDelete: (id: string) => void;
  onActivate: (flowId: string, data: any) => void;
  isDeleting?: boolean;
  isActivating: boolean;
  activationResult?: any;
  fields: any[];
};

export function FlowListCard({ item, onUpdate, onDelete, onActivate, isDeleting = false, isActivating, activationResult, fields }: FlowListCardProps) {
  const [panelIndex, setPanelIndex] = useState(0);

  const handleInitializeClick = () => {
    setPanelIndex(1);
  };

  const handleSubmit = (formData: any) => {
    onActivate(item.id, formData);
  };

  useEffect(() => {
    if (activationResult) {
      setPanelIndex(2);
    }
  }, [activationResult]);

  return (
    <MorphingDialog transition={{ type: "spring", bounce: 0.05, duration: 0.25 }}>
      {/* ───────── CARD ───────── */}
      <MorphingDialogTrigger style={{ borderRadius: "12px" }} className="flex flex-col justify-between gap-2 overflow-hidden border bg-card p-4 hover:bg-accent/50 hover:shadow-md transition-all">
        <div>
          <div className="flex items-center justify-between">
            <MorphingDialogTitle className="truncate text-base font-semibold">{item.name}</MorphingDialogTitle>

            <Badge variant="secondary" className="ml-2 bg-[var(--brand-200)]">
              {item.feature_flows.length}
            </Badge>
          </div>

          <MorphingDialogSubtitle className="mt-1 line-clamp-3 text-sm text-muted-foreground">{item.description || "No description provided."}</MorphingDialogSubtitle>
        </div>

        <div className="flex justify-end">
          <PlusIcon size={14} className="text-muted-foreground" />
        </div>
      </MorphingDialogTrigger>

      {/* ───────── DIALOG ───────── */}
      <MorphingDialogContainer>
        <MorphingDialogContent style={{ borderRadius: "24px" }} className="relative w-full max-w-[520px] border bg-card">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div>
              <MorphingDialogTitle className="text-2xl">{item.name}</MorphingDialogTitle>
              <MorphingDialogSubtitle className="text-sm text-muted-foreground">{item.feature_flows.length} Feature Flows</MorphingDialogSubtitle>
            </div>

            {/* ───────── TRANSITION PANEL ───────── */}
            <TransitionPanel activeIndex={panelIndex}>
              {/* PANEL 0 – INITIALIZE */}
              <div className="space-y-4">
                <MorphingDialogDescription>
                  <p className="text-muted-foreground">{item.description || "No description provided."}</p>
                </MorphingDialogDescription>

                {/* Footer */}
                <div className="flex justify-between pt-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => onUpdate(item.id)}>Update</DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" disabled={isDeleting} onClick={() => onDelete(item.id)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button size="sm" onClick={handleInitializeClick} disabled={isActivating}>
                    Initialize
                  </Button>
                </div>
              </div>

              {/* PANEL 0 – INITIALIZE */}
              <div className="space-y-4">
                <h4 className="font-medium">Initialize Flow</h4>

                <DynamicFormBuilder fields={fields} isLoading={isActivating} onSubmit={handleSubmit} btnVariants="outline" btnClassName="flex justify-end" />
              </div>

              {/* PANEL 1 – RESULT */}
              <div className="space-y-4">
                <h4 className="font-medium">Flow Activated</h4>

                {activationResult?.redirect_url && (
                  <div className="flex gap-2 justify-center">
                    <Button type="button" className="px-3" variant="outline" onClick={() => window.open(activationResult?.redirect_url, "_blank", "noopener,noreferrer")}>
                      <DynamicIcon name="ExternalLink" /> Redirect
                    </Button>
                    <Button type="button" className="px-3" variant="secondary" onClick={() => navigator.clipboard.writeText(activationResult.redirect_url)}>
                      <DynamicIcon name="Copy" /> Copy
                    </Button>
                  </div>
                )}

                <Button size="sm" variant="ghost" onClick={() => setPanelIndex(0)}>
                  Close
                </Button>
              </div>
            </TransitionPanel>
          </div>

          <MorphingDialogClose />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
}
