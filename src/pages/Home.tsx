import { DynamicIcon } from "@/components/common/DynamicIcon";
import { Group } from "@/components/common/Group";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function Home() {
  const navigate = useNavigate()

  return (
    <div>
      <Group position="apart" >
        <h2>Welcome to the Home Page</h2>
        <Button onClick={() => navigate("/flow-builder")} variant="secondary">Flow Builder</Button>
      </Group>
    </div>
  );
}