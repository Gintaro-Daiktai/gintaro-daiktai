import z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import {
  Clock,
  Minus,
  Package,
  Plus,
  Settings,
  Shield,
  Star,
  Ticket,
  Trash2,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "react-router";
import { processWithdrawal } from "@/lib/balance";
import Checkout from "@/components/Checkout";
import { NavLink } from "react-router";

//placeholder, real one will come from auth
const CURRENT_USER_ID = "1";

const editProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

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

type EditProfileForm = z.infer<typeof editProfileSchema>;
type DepositForm = z.input<typeof depositSchema>;
type WithdrawalForm = z.input<typeof withdrawalSchema>;

export default function ProfilePage() {
  const params = useParams();
  const isOwnProfile = params.userId === CURRENT_USER_ID;
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);
  const [isWithdrawalDialogOpen, setIsWithdrawalDialogOpen] = useState(false);
  const [balance, setBalance] = useState(2000.2); // MOCK BALANCE
  const [depositAmount, setDepositAmount] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileForm>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: "Current User Name", //placeholder, real one will come from user data
    },
  });

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

  const onSubmit = async (data: EditProfileForm) => {
    // Handle profile update logic here
    console.log("Profile updated:", data);
    setIsEditDialogOpen(false);
  };

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
      setBalance((prev) => prev - (data.amount as number));
      setIsWithdrawalDialogOpen(false);
      resetWithdrawal();
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    // Handle account deletion logic here
    console.log("Account deleted for user:", params.userId);
    setIsDeleting(false);
    window.location.href = "/";
  };
  const userProfile = {
    id: params.userId,
    name: "John Doe",
    avatar: "/diverse-user-avatars.png",
    rating: 4.8,
    positiveFeadback: "98.5%",
    totalSales: 234,
    memberSince: "January 2020",
    verified: true,
    description:
      "Professional vintage watch dealer with over 15 years of experience.",
  };
  const userAuctions = [
    {
      id: 1,
      title: "Vintage Typewriter 1940s",
      currentBid: 425,
      bids: 9,
      endTime: "4h 28m",
      status: "active",
      image: "/vintage-typewriter.jpg",
    },
    {
      id: 2,
      title: "Antique Pocket Watch",
      currentBid: 1250,
      bids: 23,
      endTime: "2h 15m",
      status: "active",
      image: "/vintage-rolex-watch.jpg",
    },
  ];
  const userLotteries = [
    {
      id: 1,
      title: "Gaming Console Bundle",
      ticketPrice: 15,
      totalTickets: 400,
      soldTickets: 287,
      endTime: "4 days",
      image: "/ps5-bundle.jpg",
      value: 599,
    },
  ];

  const userReviews = [
    {
      id: 1,
      reviewer: "Sarah M.",
      rating: 5,
      comment:
        "Excellent seller! Item exactly as described and shipped quickly.",
      date: "2 weeks ago",
      item: "Vintage Camera",
    },
    {
      id: 2,
      reviewer: "Mike R.",
      rating: 5,
      comment: "Great communication and fast shipping. Highly recommend!",
      date: "1 month ago",
      item: "Collectible Watch",
    },
    {
      id: 3,
      reviewer: "Emily K.",
      rating: 4,
      comment: "Good seller, item was as described. Packaging could be better.",
      date: "2 months ago",
      item: "Vintage Typewriter",
    },
  ];

  return (
    <main className="flex-1">
      <div className="border-b bg-muted/30">
        <div className="container py-8 px-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={userProfile.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-2xl">
                  {userProfile.name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold tracking-tight">
                    {userProfile.name}
                  </h1>
                  {userProfile.verified && (
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary border-primary/20"
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span className="font-semibold">{userProfile.rating}</span>
                    <span className="text-muted-foreground">rating</span>
                  </div>
                  <div>
                    <span className="font-semibold">
                      {userProfile.positiveFeadback}
                    </span>
                    <span className="text-muted-foreground">
                      {" "}
                      positive feedback
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">
                      {userProfile.totalSales}
                    </span>
                    <span className="text-muted-foreground"> sales</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              {isOwnProfile && (
                <NavLink to="/deliveries">
                  <Button className="cursor-pointer" variant="outline">
                    <Package className="h-4 w-4 mr-2" />
                    My Deliveries
                  </Button>
                </NavLink>
              )}

              {isOwnProfile && (
                <Dialog
                  open={isEditDialogOpen}
                  onOpenChange={setIsEditDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                      <DialogDescription>
                        Make changes to your profile here.
                      </DialogDescription>
                    </DialogHeader>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" {...register("name")} />
                        {errors.name && (
                          <p className="text-sm text-destructive">
                            {errors.name.message}
                          </p>
                        )}
                      </div>

                      <DialogFooter className="gap-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              type="button"
                              variant="destructive"
                              className="mr-auto"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Account
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete your account and remove all
                                your data from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleDeleteAccount}
                                disabled={isDeleting}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                {isDeleting ? "Deleting..." : "Delete Account"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsEditDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          {userProfile.description && (
            <p className="text-muted-foreground mt-4 max-w-2xl">
              {userProfile.description}
            </p>
          )}
        </div>
      </div>

      {isOwnProfile && (
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
                        Enter the amount you want to add to your account
                        balance.
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
      )}

      <Tabs defaultValue="auctions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="auctions" className="cursor-pointer">
            Auctions ({userAuctions.length})
          </TabsTrigger>
          <TabsTrigger value="lotteries" className="cursor-pointer">
            Lotteries ({userLotteries.length})
          </TabsTrigger>
          <TabsTrigger value="reviews" className="cursor-pointer">
            Reviews ({userReviews.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="auctions" className="space-y-6">
          {userAuctions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userAuctions.map((auction) => (
                <Card
                  key={auction.id}
                  className="group overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={auction.image || "/placeholder.svg"}
                      alt={auction.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <h3 className="font-semibold line-clamp-2 leading-snug">
                      {auction.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Current Bid
                        </p>
                        <p className="text-xl font-bold text-primary">
                          ${auction.currentBid.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          Time Left
                        </p>
                        <p className="text-sm font-semibold flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {auction.endTime}
                        </p>
                      </div>
                    </div>
                    <div className="pt-2 border-t flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        {auction.bids} bids
                      </p>
                      <Badge variant="secondary">{auction.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">No active auctions</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="lotteries" className="space-y-6">
          {userLotteries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userLotteries.map((lottery) => {
                const percentageSold =
                  (lottery.soldTickets / lottery.totalTickets) * 100;
                return (
                  <Card
                    key={lottery.id}
                    className="group overflow-hidden hover:shadow-lg transition-shadow hover:border-accent/50"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      <img
                        src={lottery.image || "/placeholder.svg"}
                        alt={lottery.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
                        <Ticket className="h-3 w-3 mr-1" />
                        Lottery
                      </Badge>
                    </div>
                    <CardContent className="p-4 space-y-3">
                      <h3 className="font-semibold line-clamp-2 leading-snug">
                        {lottery.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Ticket Price
                          </p>
                          <p className="text-xl font-bold text-accent">
                            ${lottery.ticketPrice}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            Prize Value
                          </p>
                          <p className="text-sm font-semibold">
                            ${lottery.value.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            {lottery.soldTickets} / {lottery.totalTickets}{" "}
                            tickets sold
                          </span>
                          <span className="font-medium">
                            {Math.round(percentageSold)}%
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent transition-all"
                            style={{ width: `${percentageSold}%` }}
                          />
                        </div>
                      </div>
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Ends in {lottery.endTime}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">No active lotteries</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          {userReviews.length > 0 ? (
            <div className="space-y-4">
              {userReviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6 text-left">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{review.reviewer[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{review.reviewer}</p>
                          <p className="text-xs text-muted-foreground">
                            {review.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "fill-yellow-500 text-yellow-500"
                                : "fill-muted text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-2">
                      {review.comment}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Purchase:{" "}
                      <span className="font-medium text-foreground">
                        {review.item}
                      </span>
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">No reviews yet</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}
