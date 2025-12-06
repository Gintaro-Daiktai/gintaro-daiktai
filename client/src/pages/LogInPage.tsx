import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useLoginMutation } from "@/api/queries";
import { useAuth } from "@/hooks/useAuth";
import { decodeToken } from "@/utils/token";
import { VerifyEmailDialog } from "@/components/VerifyEmailDialog";
import { Loader2 } from "lucide-react";
import type { User } from "@/types/auth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LogInPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const loginMutation = useLoginMutation();
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [unverifiedUserId, setUnverifiedUserId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await loginMutation.mutateAsync(data);

      const decoded = decodeToken(response.token);
      if (!decoded) {
        throw new Error("Invalid token");
      }

      const user: User = {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role,
        confirmed: decoded.confirmed,
        name: "",
        last_name: "",
        phone_number: "",
        balance: 0,
        registration_date: new Date(),
        birth_date: new Date(),
      };

      setAuth(response.token, user);

      if (!response.confirmed) {
        setUnverifiedEmail(decoded.email);
        setUnverifiedUserId(decoded.sub);
        setShowVerifyDialog(true);
      } else {
        navigate("/");
      }
    } catch {
      // Error handled by mutation
    }
  };
  return (
    <div className="flex flex-col min-h-0">
      <main className="flex flex-1 items-center min-h-0">
        <div className="container py-22">
          <div className="mx-auto max-w-md">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl">
                  Log in to your account
                </CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {loginMutation.isError && (
                    <p className="text-sm text-red-500">
                      {loginMutation.error instanceof Error
                        ? loginMutation.error.message
                        : "Login failed. Please try again."}
                    </p>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      placeholder="john@example.com"
                      {...register("email")}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      {...register("password")}
                      className={errors.password ? "border-red-500" : ""}
                    />
                    {errors.password && (
                      <p className="text-sm text-red-500">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full cursor-pointer"
                    size="lg"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {loginMutation.isPending ? "Signing in..." : "Sign in"}
                  </Button>

                  <p className="text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <NavLink
                      to="/signup"
                      className="text-primary hover:underline font-medium"
                    >
                      Sign up
                    </NavLink>
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {unverifiedUserId && (
        <VerifyEmailDialog
          open={showVerifyDialog}
          onOpenChange={setShowVerifyDialog}
          userId={unverifiedUserId}
          email={unverifiedEmail}
          onSuccess={() => navigate("/")}
        />
      )}
    </div>
  );
}

export default LogInPage;
