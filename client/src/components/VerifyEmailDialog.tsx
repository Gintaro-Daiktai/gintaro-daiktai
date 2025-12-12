import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useVerifyEmailMutation, useResendCodeMutation } from "@/api/auth";
import { Loader2 } from "lucide-react";

interface VerifyEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: number;
  email: string;
  onSuccess?: () => void;
}

export function VerifyEmailDialog({
  open,
  onOpenChange,
  userId,
  email,
  onSuccess,
}: VerifyEmailDialogProps) {
  const [code, setCode] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const verifyMutation = useVerifyEmailMutation();
  const resendMutation = useResendCodeMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (code.length !== 6) {
      return;
    }

    try {
      await verifyMutation.mutateAsync({ userId, code });
      onSuccess?.();
      onOpenChange(false);
    } catch {
      // Error handled by mutation
    }
  };

  const handleResend = async () => {
    try {
      await resendMutation.mutateAsync({ userId });
      setSuccessMessage("Verification code sent to your email!");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verify Your Email</DialogTitle>
          <DialogDescription>
            We've sent a 6-digit verification code to <strong>{email}</strong>.
            Please enter it below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {verifyMutation.isError && (
            <p className="text-sm text-red-500">
              {verifyMutation.error instanceof Error
                ? verifyMutation.error.message
                : "Invalid verification code. Please try again."}
            </p>
          )}

          {resendMutation.isError && (
            <p className="text-sm text-red-500">
              {resendMutation.error instanceof Error
                ? resendMutation.error.message
                : "Failed to resend code. Please try again."}
            </p>
          )}

          {successMessage && (
            <p className="text-sm text-green-600">{successMessage}</p>
          )}

          <div className="space-y-2">
            <Label htmlFor="code">Verification Code</Label>
            <Input
              id="code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              className="text-center text-2xl tracking-widest"
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-2">
            <Button
              type="submit"
              disabled={code.length !== 6 || verifyMutation.isPending}
              className="w-full"
            >
              {verifyMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Verify Email
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={handleResend}
              disabled={resendMutation.isPending}
              className="w-full"
            >
              {resendMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Resend Code
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
