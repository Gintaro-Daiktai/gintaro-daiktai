import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useAuction } from "@/hooks/useAuctions";
import { useAuth } from "@/hooks/useAuth";
import { AuctionItemDisplay } from "@/components/auction/AuctionItemDisplay";
import { AuctionStats } from "@/components/auction/AuctionStats";
import { AuctionBidList } from "@/components/auction/AuctionBidList";
import { BidForm } from "@/components/auction/BidForm";
import { CancelAuctionButton } from "@/components/auction/CancelAuctionButton";

export default function AuctionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { auction, isLoading, refetch } = useAuction(id ? parseInt(id) : null);

  const isOwner = auction?.user?.id === user?.id;
  const isActive = auction?.auction_status === "started";
  const canBid = !isOwner && isActive;
  const canCancel = isOwner;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Auction Not Found</h2>
          <Button onClick={() => navigate("/auctions")}>
            Back to Auctions
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 py-4">
        <div className="container max-w-4xl mx-auto">
          <AuctionPageHeader
            canCancel={canCancel}
            auctionId={auction.id}
            onCancelled={() => navigate("/auctions")}
          />

          <div className="space-y-6">
            <AuctionItemDisplay item={auction.item} />

            <AuctionStats auction={auction} />

            {auction.auctionBids && auction.auctionBids.length > 0 && (
              <AuctionBidList bids={auction.auctionBids} />
            )}

            {canBid && <BidForm auction={auction} onBidPlaced={refetch} />}

            {isOwner && <AuctionOwnerNotice />}

            {!isActive && (
              <AuctionStatusNotice status={auction.auction_status} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

interface AuctionPageHeaderProps {
  canCancel: boolean;
  auctionId: number;
  onCancelled: () => void;
}

function AuctionPageHeader({
  canCancel,
  auctionId,
  onCancelled,
}: AuctionPageHeaderProps) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <Link to="/auctions">
        <Button variant="ghost" size="sm" className="cursor-pointer">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Auctions
        </Button>
      </Link>
      {canCancel && (
        <CancelAuctionButton auctionId={auctionId} onCancelled={onCancelled} />
      )}
    </div>
  );
}

function AuctionOwnerNotice() {
  return (
    <div className="p-4 bg-muted/50 rounded-lg text-center">
      <p className="text-sm text-muted-foreground">
        You are the owner of this auction
      </p>
    </div>
  );
}

interface AuctionStatusNoticeProps {
  status: string;
}

function AuctionStatusNotice({ status }: AuctionStatusNoticeProps) {
  return (
    <div className="p-4 bg-muted/50 rounded-lg text-center">
      <p className="text-sm text-muted-foreground">This auction is {status}</p>
    </div>
  );
}
