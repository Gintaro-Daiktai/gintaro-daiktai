import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Star, Trash2, Plus } from "lucide-react";
import { EmojiDisplay } from "@/components/EmojiDisplay";
import type { Review } from "@/types/profile";

type ReviewCardProps = {
  review: Review;
  availableEmojis: string[];
  onToggleReaction: (reviewId: number, emoji: string) => void;
  onDelete: (reviewId: number) => void;
  currentUserId?: number;
};

export function ReviewCard({
  review,
  availableEmojis,
  onToggleReaction,
  onDelete,
  currentUserId,
}: ReviewCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{review.reviewer[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{review.reviewer}</p>
              <p className="text-xs text-muted-foreground">{review.date}</p>
            </div>
          </div>
          <div className="flex gap-3">
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
            {currentUserId === review.reviewerId && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Review</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this review? This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(review.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
        {review.title && (
          <h3 className="font-semibold text-lg mb-2">{review.title}</h3>
        )}
        <p className="text-muted-foreground mb-2">{review.comment}</p>
        <p className="text-xs text-muted-foreground mb-4">
          Purchase:{" "}
          <span className="font-medium text-foreground">{review.item}</span>
        </p>

        <div className="flex items-center gap-2 pt-3 border-t flex-wrap">
          {review.reactions
            .filter((reaction) => reaction.count > 0)
            .map((reaction) => {
              const isActive = reaction.userReacted;

              return (
                <button
                  key={reaction.emoji}
                  onClick={() => onToggleReaction(review.id, reaction.emoji)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all hover:scale-105 ${
                    isActive
                      ? "bg-primary/20 border-primary/40 border"
                      : "bg-muted hover:bg-muted/80 border border-transparent"
                  }`}
                >
                  <EmojiDisplay
                    emoji={reaction.emoji}
                    className="text-base leading-none"
                  />
                  <span
                    className={`text-xs font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}
                  >
                    {reaction.count}
                  </span>
                </button>
              );
            })}

          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center justify-center h-8 w-8 rounded-full bg-muted hover:bg-muted/80 border border-transparent transition-all hover:scale-105">
                <Plus className="h-4 w-4 text-muted-foreground" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="start">
              <div className="flex gap-1">
                {availableEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => onToggleReaction(review.id, emoji)}
                    className="flex items-center justify-center h-10 w-10 rounded-lg hover:bg-muted transition-colors"
                  >
                    <EmojiDisplay
                      emoji={emoji}
                      className="text-xl leading-none"
                    />
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
}
