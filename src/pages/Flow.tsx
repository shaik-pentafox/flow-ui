// src/pages/Flow.tsx
import { Group } from "@/components/common/Group";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function Flow() {
  const navigate = useNavigate()

  return (
    <div>
      <Group position="apart" >
        <h2>Welcome to the Flow Page</h2>
        <Button onClick={() => navigate("/flow-builder")} variant="secondary">Flow Builder</Button>
      </Group>
    </div>
  );
}