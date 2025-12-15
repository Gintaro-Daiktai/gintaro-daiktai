import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLottery } from "@/hooks/useLotteries";
import { CancelLotteryButton } from "@/components/lottery/CancelLotteryButton";
import { LotteryItemsDisplay } from "@/components/lottery/AuctionItemDisplay";
import { LotteryStats } from "@/components/lottery/LotteryStats";
import { LotteryBidForm } from "@/components/lottery/LotteryBidForm";

export default function LotteryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { lottery, isLoading, refetch } = useLottery(id ? parseInt(id) : null);

  if (!lottery) {
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

  const isOwner = lottery?.user?.id === user?.id;

  const isActive = new Date(lottery.end_date) > new Date();
  const canBid = !isOwner && isActive;
  const canCancel = isOwner && !(lottery?.lottery_status === "finished");

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 py-4">
        <div className="container max-w-4xl mx-auto">
          <LotteryPageHeader
            canCancel={canCancel}
            lotteryId={lottery.id}
            onCancelled={() => navigate("/auctions")}
          />

          <div className="space-y-6">
            <LotteryItemsDisplay items={lottery.items} />

            <LotteryStats lottery={lottery} />

            {canBid && (
              <LotteryBidForm lottery={lottery} onBidPlaced={refetch} />
            )}

            {isOwner && <LotteryOwnerNotice />}

            {!isActive && (
              <LotteryStatusNotice status={lottery.lottery_status} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

interface LotteryPageHeaderProps {
  canCancel: boolean;
  lotteryId: number;
  onCancelled: () => void;
}

function LotteryPageHeader({
  canCancel,
  lotteryId,
  onCancelled,
}: LotteryPageHeaderProps) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <Link to="/lotteries">
        <Button variant="ghost" size="sm" className="cursor-pointer">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Lotteries
        </Button>
      </Link>
      {canCancel && (
        <CancelLotteryButton lotteryId={lotteryId} onCancelled={onCancelled} />
      )}
    </div>
  );
}

function LotteryOwnerNotice() {
  return (
    <div className="p-4 bg-muted/50 rounded-lg text-center">
      <p className="text-sm text-muted-foreground">
        You are the owner of this lottery!
      </p>
    </div>
  );
}

interface LotteryStatusNoticeProps {
  status: string;
}

function LotteryStatusNotice({ status }: LotteryStatusNoticeProps) {
  return (
    <div className="p-4 bg-muted/50 rounded-lg text-center">
      <p className="text-sm text-muted-foreground">This lottery is {status}</p>
    </div>
  );
}
