import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { useSignupMutation } from "@/api/queries";
import { VerifyEmailDialog } from "@/components/VerifyEmailDialog";
import { Loader2 } from "lucide-react";
import type { SignupData } from "@/types/auth";

const signupSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .regex(/^[0-9+\-\s()]+$/, "Invalid phone number format"),
    birthDate: z.string().min(1, "Birth date is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    terms: z
      .boolean()
      .refine(
        (val) => val === true,
        "You must accept the terms and conditions",
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

function SignUpPage() {
  const navigate = useNavigate();
  const signupMutation = useSignupMutation();
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [newUserId, setNewUserId] = useState<number | null>(null);
  const [newUserEmail, setNewUserEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });
  const termsAccepted = watch("terms");

  const onSubmit = async (data: SignupFormData) => {
    const signupData: SignupData = {
      name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: data.password,
      phone_number: data.phoneNumber,
      birth_date: data.birthDate,
    };

    try {
      const response = await signupMutation.mutateAsync(signupData);
      setNewUserId(response.userId);
      setNewUserEmail(response.email);
      setShowVerifyDialog(true);
    } catch {
      // Error handled by mutation
    }
  };
  return (
    <main className="flex flex-1 items-center">
      <div className="container py-24">
        <div className="mx-auto max-w-md">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">Create your account</CardTitle>
              <CardDescription>
                Enter your details below to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {signupMutation.isError && (
                  <p className="text-sm text-red-500">
                    {signupMutation.error instanceof Error
                      ? signupMutation.error.message
                      : "Signup failed. Please try again."}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      {...register("firstName")}
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-500">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      {...register("lastName")}
                      className={errors.lastName ? "border-red-500" : ""}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-500">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
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
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+370 600 12345"
                    {...register("phoneNumber")}
                    className={errors.phoneNumber ? "border-red-500" : ""}
                  />
                  {errors.phoneNumber && (
                    <p className="text-sm text-red-500">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">Birth Date</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    {...register("birthDate")}
                    className={errors.birthDate ? "border-red-500" : ""}
                  />
                  {errors.birthDate && (
                    <p className="text-sm text-red-500">
                      {errors.birthDate.message}
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    {...register("confirmPassword")}
                    className={errors.confirmPassword ? "border-red-500" : ""}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={termsAccepted}
                      onCheckedChange={(checked) =>
                        setValue("terms", checked as boolean)
                      }
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the{" "}
                      <NavLink
                        to="/terms"
                        className="text-primary hover:underline"
                      >
                        Terms of Service
                      </NavLink>{" "}
                      and{" "}
                      <NavLink
                        to="/privacy"
                        className="text-primary hover:underline"
                      >
                        Privacy Policy
                      </NavLink>
                    </label>
                  </div>
                  {errors.terms && (
                    <p className="text-sm text-red-500">
                      {errors.terms.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={signupMutation.isPending}
                >
                  {signupMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {signupMutation.isPending
                    ? "Creating account..."
                    : "Create account"}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <NavLink
                    to="/login"
                    className="text-primary hover:underline font-medium"
                  >
                    Log In
                  </NavLink>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {newUserId && (
        <VerifyEmailDialog
          open={showVerifyDialog}
          onOpenChange={setShowVerifyDialog}
          userId={newUserId}
          email={newUserEmail}
          onSuccess={() => navigate("/")}
        />
      )}
    </main>
  );
}

export default SignUpPage;
