import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import {
  useUserProfile,
  useUpdateUserProfile,
  useDeleteUser,
} from "@/api/auth";
import { useProfileReviews } from "@/hooks/useProfileReviews";
import { statisticsApi } from "@/api/statistics";
import { useUserAuctions } from "@/hooks/useAuctions";
import { createSafeAvatarDataUri } from "@/utils/imageValidation";
import type { UserProfile, Lottery } from "@/types/profile";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { BalanceCard } from "@/components/profile/BalanceCard";
import { ProfileTabs } from "@/components/profile/ProfileTabs";

export default function ProfilePage() {
  const params = useParams();
  const { user: currentUser, clearAuth } = useAuth();
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
  const [pastAuctionsCount, setPastAuctionsCount] = useState<number>(0);
  const [pastLotteriesCount, setPastLotteriesCount] = useState<number>(0);
  const updateMutation = useUpdateUserProfile();
  const deleteMutation = useDeleteUser();

  const { reviews, toggleReaction, deleteReview } = useProfileReviews(
    profileUserId,
    currentUser?.id,
  );

  useEffect(() => {
    const fetchPastCounts = async () => {
      if (!isOwnProfile) return;
      
      try {
        const [auctions, lotteries] = await Promise.all([
          statisticsApi.getAuctionsList(),
          statisticsApi.getLotteriesList(),
        ]);
        setPastAuctionsCount(auctions.length);
        setPastLotteriesCount(lotteries.length);
      } catch (error) {
        console.error('Failed to fetch past auctions/lotteries:', error);
      }
    };

    fetchPastCounts();
  }, [isOwnProfile]);
  const { auctions, isLoading: auctionsLoading } =
    useUserAuctions(profileUserId);

  const handleProfileUpdate = async (data: {
    name: string;
    lastName: string;
    phoneNumber: string;
    avatar?: string;
  }) => {
    if (!profileData) return;

    await updateMutation.mutateAsync({
      userId: profileData.id,
      data: {
        name: data.name,
        last_name: data.lastName,
        phone_number: data.phoneNumber,
        avatar: data.avatar,
      },
    });
  };

  const handleAccountDelete = async () => {
    if (!profileData) return;

    try {
      await deleteMutation.mutateAsync(profileData.id);
      clearAuth();
      window.location.href = "/";
    } catch (error) {
      console.error("Failed to delete account:", error);
    }
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

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  const totalSales = auctions.filter(
    (auction) => auction.auction_status === "sold",
  ).length;

  const userProfile: UserProfile = {
    id: profileData.id.toString(),
    name: `${profileData.name} ${profileData.last_name}`,
    avatar: createSafeAvatarDataUri(profileData.avatar, "image/jpeg"),
    rating: Math.round(averageRating * 10) / 10,
    totalSales,
    memberSince: new Date(profileData.registration_date).toLocaleDateString(
      "en-US",
      { month: "long", year: "numeric" },
    ),
    verified: profileData.confirmed,
  };

  return (
    <main className="flex-1">
      <ProfileHeader
        profile={userProfile}
        profileData={profileData}
        isOwnProfile={isOwnProfile}
        onProfileUpdate={handleProfileUpdate}
        onAccountDelete={handleAccountDelete}
      />

      {isOwnProfile && (
        <BalanceCard balance={balance} onBalanceChange={setBalance} />
      )}

      <ProfileTabs
        auctions={auctionsLoading ? [] : auctions}
        lotteries={userLotteries}
        reviews={reviews}
        availableEmojis={availableEmojis}
        onToggleReaction={toggleReaction}
        onDeleteReview={deleteReview}
        pastAuctionsCount={pastAuctionsCount}
        pastLotteriesCount={pastLotteriesCount}
        isOwnProfile={isOwnProfile}
      />
    </main>
  );
}

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

const availableEmojis = [
  "👍",
  "👎",
  "😊",
  "😢",
  "😠",
  "🔥",
  "😂",
  "❤️",
  "67",
  "🐟",
];
