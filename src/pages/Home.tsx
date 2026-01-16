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
        <h2>Welcome to the Home Page</h2>
        <Button onClick={() => loginMutation.mutate({ name: env.DEMO_USER, password: env.DEMO_PASSWORD })}>Authenticate</Button>
        <Button onClick={() => navigate("/flow-builder")} variant="secondary">
          Flow Builder
        </Button>
      </Group>
    </div>
  );
}
