// src/pages/Home.tsx
import { Group } from "@/components/common/Group";
import { Button } from "@/components/ui/button";
import { logIn, type loginPayload } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { env } from "@/config";
import { ModeToggle } from "@/components/common/ModeToggle";
import { MorphingDialogBasicOne } from "@/components/common/MorphingDialog";

export function Home() {
  const { login } = useAuthStore.getState();

  const loginMutation = useMutation<any, any, loginPayload>({
    mutationFn: (body) => logIn(body),
    onSuccess: (res) => {
      const auth = res;
      const accessToken = auth?.access_token;
      const decodedToken = jwtDecode(accessToken);

      login({
        user: { auth, decodedToken },
        token: accessToken,
      });

      toast.success(res.message || "Successfully authenticated");
    },
    onError: (error) => {
      toast.error(error.message || "Authentication failed");
    },
  });

  const navigate = useNavigate();

  return (
    <div>
      <Group position="apart">
        <h2 className="text-xl font-semibold tracking-tight text-sidebar-accent-foreground">Dashboard</h2>
        {/* <Button onClick={() => loginMutation.mutate({ name: env.DEMO_USER, password: env.DEMO_PASSWORD })} variant="outline">Authenticate</Button> */}
        <div className="flex items-center gap-2">
          <Button onClick={() => navigate("/flow-builder")} variant="secondary">
            Flow Builder
          </Button>

          <ModeToggle />
        </div>
      </Group>
      <div>
        <MorphingDialogBasicOne />
      </div>
    </div>
  );
}
