import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NavLink } from "react-router";
import type { Review, Auction, Lottery } from "@/types/profile";
import { AuctionCard } from "./AuctionCard";
import { LotteryCard } from "./LotteryCard";
import { ReviewCard } from "./ReviewCard";

interface ProfileTabsProps {
  auctions: Auction[];
  lotteries: Lottery[];
  reviews: Review[];
  availableEmojis: string[];
  onToggleReaction: (reviewId: number, emoji: string) => void;
  onDeleteReview: (reviewId: number) => void;
  pastAuctionsCount?: number;
  pastLotteriesCount?: number;
  isOwnProfile?: boolean;
}

export function ProfileTabs({
  auctions,
  lotteries,
  reviews,
  availableEmojis,
  onToggleReaction,
  onDeleteReview,
  pastAuctionsCount = 0,
  pastLotteriesCount = 0,
  isOwnProfile = false,
}: ProfileTabsProps) {
  return (
    <Tabs defaultValue="auctions" className="space-y-6 mt-6">
      <div className="flex flex-row">
        <TabsList>
          <TabsTrigger value="auctions" className="cursor-pointer">
            Auctions ({auctions.length})
          </TabsTrigger>
          <TabsTrigger value="lotteries" className="cursor-pointer">
            Lotteries ({lotteries.length})
          </TabsTrigger>
          <TabsTrigger value="reviews" className="cursor-pointer">
            Reviews ({reviews.length})
          </TabsTrigger>
        </TabsList>

        {isOwnProfile && (
          <div className="ml-auto">
            <NavLink to="/auctionslist">
              <Button variant="link" className="cursor-pointer">
                View Past Auctions ({pastAuctionsCount})
              </Button>
            </NavLink>
            <NavLink to="/lotterieslist">
              <Button variant="link" className="cursor-pointer">
                View Past Lotteries ({pastLotteriesCount})
              </Button>
            </NavLink>
          </div>
        )}
      </div>

      <TabsContent value="auctions" className="space-y-6">
        {auctions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {auctions.map((auction) => (
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
        {lotteries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lotteries.map((lottery) => (
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
                onToggleReaction={onToggleReaction}
                onDelete={onDeleteReview}
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
  );
}
