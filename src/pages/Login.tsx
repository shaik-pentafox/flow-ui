// src/pages/Login.tsx
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";
import { logIn } from "@/services/auth.service";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";

// --- 1. Background Animation Component ---
function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${
      616 - i * 5 * position
    } ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    color: `rgba(15,23,42,${0.1 + i * 0.03})`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg className="h-full w-full text-[var(--brand-500)]" fill="none" viewBox="0 0 696 316">
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.03}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

const loginSchema = z.object({
  name: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type LoginFormValues = z.infer<typeof loginSchema>;

// --- 2. Main Login Page Component ---
export default function LoginPage() {
  const { login } = useAuthStore.getState();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      name: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const loginMutation = useMutation({
    mutationFn: logIn,
    onSuccess: (res) => {
      const accessToken = res?.access_token;
      const decodedToken = jwtDecode(accessToken);

      login({
        user: { auth: res, decodedToken },
        token: accessToken,
      });

      toast.success(res.message || "Successfully authenticated");
      navigate("/");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Authentication failed");
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    console.log(values, "----login values---");
    loginMutation.mutate(values);
  };

  return (
    <div className="relative flex min-h-screen w-full bg-white dark:bg-neutral-950">
      {/* LEFT COLUMN: Testimonial & Animation (Hidden on mobile) */}
      <div className="relative hidden w-1/2 flex-col border-r border-neutral-200 bg-neutral-100 p-10 lg:flex dark:border-neutral-800 dark:bg-neutral-900">
        {/* Logo Placeholder */}
        <div className="relative z-10 flex items-center gap-2 font-bold text-xl">
          <img src={isDarkMode ? "/darkLogo.png" : "/logo.png"} alt="FastKYC Logo" className="h-10 rounded-lg" />
        </div>

        <div className="relative z-10 mt-auto">
          <blockquote className="space-y-4">
            <p className="text-xl font-medium leading-relaxed text-neutral-800 dark:text-neutral-200">
              We build compliant KYC flows in minutes instead of weeks. Faster onboarding, fewer errors, and total control.
            </p>
            {/* <footer className="font-mono text-sm font-semibold text-neutral-600 dark:text-neutral-400"> Ali Hassan, Product Lead</footer> */}
          </blockquote>
        </div>

        {/* The Animation Layer */}
        <div className="absolute inset-0 overflow-hidden">
          <FloatingPaths position={1} />
          <FloatingPaths position={-1} />
        </div>
      </div>

      {/* RIGHT COLUMN:  */}
      <div className="relative flex w-full flex-col justify-center bg-white p-8 lg:w-1/2 dark:bg-background">
        <div className="relative mx-auto w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="mb-8 flex items-center justify-center gap-2 font-bold text-xl lg:hidden">
            <img src={isDarkMode ? "/darkLogo.png" : "/logo.png"} alt="FastKYC Logo" className="h-15 rounded-lg" />
          </div>

          <div className="mb-8 flex flex-col space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">Login to your account</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Enter your credentials to access your account</p>
          </div>

          <div className="space-y-4">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name" className="mb-2 ml-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  User
                </Label>
                <Input id="name" type="text" placeholder="Enter your name" {...form.register("name")} className="mb-4" />
                <Label htmlFor="password" className="mb-2 ml-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Password
                </Label>
                <Input id="password" type="password" placeholder="Enter your password" {...form.register("password")} className="mb-4" />
              </div>
              <Button type="submit" className="w-full" variant="secondary" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
