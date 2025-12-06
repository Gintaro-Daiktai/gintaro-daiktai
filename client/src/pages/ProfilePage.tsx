import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "react-router";
import { NavLink } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/api/auth";
import type { Review, UserProfile, Auction, Lottery } from "@/types/profile";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { BalanceCard } from "@/components/profile/BalanceCard";
import { AuctionCard } from "@/components/profile/AuctionCard";
import { LotteryCard } from "@/components/profile/LotteryCard";
import { ReviewCard } from "@/components/profile/ReviewCard";

export default function ProfilePage() {
  const params = useParams();
  const { user: currentUser } = useAuth();
  const profileUserId = params.userId
    ? parseInt(params.userId)
    : currentUser?.id || null;
  const isOwnProfile = currentUser?.id === profileUserId;

  const {
    data: profileData,
    isLoading,
    isError,
  } = useUserProfile(profileUserId);

  const [balance, setBalance] = useState(profileData?.balance || 0);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);

  const handleProfileUpdate = (name: string) => {
    console.log("Profile updated:", name);
    // Handle profile update logic here
  };

  const handleAccountDelete = async () => {
    console.log("Account deleted for user:", params.userId);
    window.location.href = "/";
  };
  const toggleReaction = (reviewId: number, emoji: string) => {
    setReviews((prevReviews) =>
      prevReviews.map((review) => {
        if (review.id !== reviewId) return review;

        const existingReaction = review.reactions.find(
          (r) => r.emoji === emoji,
        );

        if (existingReaction) {
          return {
            ...review,
            reactions: review.reactions
              .map((r) =>
                r.emoji === emoji
                  ? {
                      ...r,
                      count: r.userReacted ? r.count - 1 : r.count + 1,
                      userReacted: !r.userReacted,
                    }
                  : r,
              )
              .filter((r) => r.count > 0),
          };
        } else {
          return {
            ...review,
            reactions: [
              ...review.reactions,
              { emoji, count: 1, userReacted: true },
            ],
          };
        }
      }),
    );
  };

  const deleteReview = (reviewId: number) => {
    setReviews((prevReviews) =>
      prevReviews.filter((review) => review.id !== reviewId),
    );
  };

  if (profileData && balance !== profileData.balance) {
    setBalance(profileData.balance);
  }

  if (isLoading) {
    return (
      <main className="flex-1 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </main>
    );
  }

  if (isError || !profileData) {
    return (
      <main className="flex-1 flex items-center justify-center min-h-screen">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-12 text-center">
            <p className="text-red-500 mb-4">Failed to load profile</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const userProfile: UserProfile = {
    id: profileData.id.toString(),
    name: `${profileData.name} ${profileData.last_name}`,
    avatar: profileData.avatar || "/diverse-user-avatars.png",
    rating: 4.8, // TODO: Calculate from reviews
    positiveFeadback: "98.5%", // TODO: Calculate from reviews
    totalSales: 234, // TODO: Get from backend
    memberSince: new Date(profileData.registration_date).toLocaleDateString(
      "en-US",
      { month: "long", year: "numeric" },
    ),
    verified: profileData.confirmed,
    description:
      "Professional vintage watch dealer with over 15 years of experience.", // TODO: Add to backend
  };

  return (
    <main className="flex-1">
      <ProfileHeader
        profile={userProfile}
        isOwnProfile={isOwnProfile}
        onProfileUpdate={handleProfileUpdate}
        onAccountDelete={handleAccountDelete}
      />

      {isOwnProfile && (
        <BalanceCard balance={balance} onBalanceChange={setBalance} />
      )}

      <Tabs defaultValue="auctions" className="space-y-6 mt-6">
        <div className="flex flex-row">
          <TabsList>
            <TabsTrigger value="auctions" className="cursor-pointer">
              Auctions ({userAuctions.length})
            </TabsTrigger>
            <TabsTrigger value="lotteries" className="cursor-pointer">
              Lotteries ({userLotteries.length})
            </TabsTrigger>
            <TabsTrigger value="reviews" className="cursor-pointer">
              Reviews ({reviews.length})
            </TabsTrigger>
          </TabsList>

          <div className="ml-auto">
            <NavLink to="/auctionslist">
              <Button variant="link" className="cursor-pointer">
                View Past Auctions (9)
              </Button>
            </NavLink>
            <NavLink to="/lotterieslist">
              <Button variant="link" className="cursor-pointer">
                View Past Lotteries (5)
              </Button>
            </NavLink>
          </div>
        </div>

        <TabsContent value="auctions" className="space-y-6">
          {userAuctions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userAuctions.map((auction) => (
                <AuctionCard key={auction.id} auction={auction} />
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
              {userLotteries.map((lottery) => (
                <LotteryCard key={lottery.id} lottery={lottery} />
              ))}
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
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  availableEmojis={availableEmojis}
                  onToggleReaction={toggleReaction}
                  onDelete={deleteReview}
                />
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

// Mock data for auctions and lotteries
const userAuctions: Auction[] = [
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

const userLotteries: Lottery[] = [
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

const mockReviews: Review[] = [
  {
    id: 1,
    reviewer: "Sarah M.",
    rating: 5,
    comment: "Excellent seller! Item exactly as described and shipped quickly.",
    date: "2 weeks ago",
    item: "Vintage Camera",
    reactions: [
      { emoji: "👍", count: 5, userReacted: false },
      { emoji: "❤️", count: 3, userReacted: false },
      { emoji: "😊", count: 2, userReacted: false },
    ],
  },
  {
    id: 2,
    reviewer: "Mike R.",
    rating: 5,
    comment: "Great communication and fast shipping. Highly recommend!",
    date: "1 month ago",
    item: "Collectible Watch",
    reactions: [
      { emoji: "👍", count: 8, userReacted: true },
      { emoji: "❤️", count: 1, userReacted: false },
      { emoji: "🔥", count: 4, userReacted: false },
    ],
  },
  {
    id: 3,
    reviewer: "Emily K.",
    rating: 4,
    comment: "Good seller, item was as described. Packaging could be better.",
    date: "2 months ago",
    item: "Vintage Typewriter",
    reactions: [
      { emoji: "👍", count: 2, userReacted: false },
      { emoji: "😊", count: 1, userReacted: false },
    ],
  },
];

const availableEmojis = ["👍", "❤️", "😊", "🔥", "👏"];
