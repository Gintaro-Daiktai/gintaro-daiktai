import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, Plus, Minus } from "lucide-react";
import { processWithdrawal } from "@/lib/balance";
import Checkout from "@/components/Checkout";

const depositSchema = z.object({
  amount: z.coerce
    .number()
    .min(1, "Minimum deposit is $1.00")
    .max(10000, "Maximum deposit is $10,000.00"),
});

const withdrawalSchema = z.object({
  amount: z.coerce
    .number()
    .min(1, "Minimum withdrawal is $1.00")
    .max(10000, "Maximum withdrawal is $10,000.00"),
});

type DepositForm = z.input<typeof depositSchema>;
type WithdrawalForm = z.input<typeof withdrawalSchema>;

type BalanceCardProps = {
  balance: number;
  onBalanceChange: (newBalance: number) => void;
};

export function BalanceCard({ balance, onBalanceChange }: BalanceCardProps) {
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);
  const [isWithdrawalDialogOpen, setIsWithdrawalDialogOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState<number | null>(null);

  const {
    register: registerDeposit,
    handleSubmit: handleDepositSubmit,
    formState: { errors: depositErrors },
    reset: resetDeposit,
  } = useForm<DepositForm>({
    resolver: zodResolver(depositSchema),
  });

  const {
    register: registerWithdrawal,
    handleSubmit: handleWithdrawalSubmit,
    formState: { errors: withdrawalErrors, isSubmitting: isWithdrawing },
    reset: resetWithdrawal,
  } = useForm<WithdrawalForm>({
    resolver: zodResolver(withdrawalSchema),
  });

  const onDepositSubmit = async (data: DepositForm) => {
    const amountInCents = Math.round((data.amount as number) * 100);
    setDepositAmount(amountInCents);
  };

  const onWithdrawalSubmit = async (data: WithdrawalForm) => {
    if ((data.amount as number) > balance) {
      alert("Insufficient balance for this withdrawal.");
      return;
    }

    const amountInCents = Math.round((data.amount as number) * 100);
    const result = await processWithdrawal(amountInCents);

    if (result.success) {
      onBalanceChange(balance - (data.amount as number));
      setIsWithdrawalDialogOpen(false);
      resetWithdrawal();
    }
  };

  return (
    <Card className="my-8 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Store Balance</p>
              <p className="text-3xl font-bold">
                $
                {balance.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Dialog
              open={isDepositDialogOpen}
              onOpenChange={(open) => {
                setIsDepositDialogOpen(open);
                if (!open) {
                  setDepositAmount(null);
                  resetDeposit();
                }
              }}
            >
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Funds
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Funds to Balance</DialogTitle>
                  <DialogDescription>
                    Enter the amount you want to add to your account balance.
                  </DialogDescription>
                </DialogHeader>
                {depositAmount === null ? (
                  <form
                    onSubmit={handleDepositSubmit(onDepositSubmit)}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="deposit-amount">Amount (USD)</Label>
                      <Input
                        id="deposit-amount"
                        type="number"
                        step="0.01"
                        placeholder="100.00"
                        {...registerDeposit("amount")}
                      />
                      {depositErrors.amount && (
                        <p className="text-sm text-destructive">
                          {depositErrors.amount.message}
                        </p>
                      )}
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDepositDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Continue to Payment</Button>
                    </DialogFooter>
                  </form>
                ) : (
                  <div className="py-4">
                    <Checkout amountInCents={depositAmount} />
                  </div>
                )}
              </DialogContent>
            </Dialog>

            <Dialog
              open={isWithdrawalDialogOpen}
              onOpenChange={(open) => {
                setIsWithdrawalDialogOpen(open);
                if (!open) resetWithdrawal();
              }}
            >
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Minus className="h-4 w-4" />
                  Withdraw
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Withdraw Funds</DialogTitle>
                  <DialogDescription>
                    Enter the amount you want to withdraw from your balance.
                  </DialogDescription>
                </DialogHeader>
                <form
                  onSubmit={handleWithdrawalSubmit(onWithdrawalSubmit)}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="withdrawal-amount">Amount (USD)</Label>
                    <Input
                      id="withdrawal-amount"
                      type="number"
                      step="0.01"
                      placeholder="100.00"
                      {...registerWithdrawal("amount")}
                    />
                    {withdrawalErrors.amount && (
                      <p className="text-sm text-destructive">
                        {withdrawalErrors.amount.message}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Available balance: $
                      {balance.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsWithdrawalDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isWithdrawing}>
                      {isWithdrawing ? "Processing..." : "Withdraw"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
