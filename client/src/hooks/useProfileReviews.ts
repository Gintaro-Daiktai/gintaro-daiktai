import { useState, useEffect, useCallback } from "react";
import { reviewsApi } from "@/api/reviews";
import type { ReviewResponse, ReviewEmote } from "@/types/review";
import type { Review } from "@/types/profile";

const EMOJI_MAP: Record<ReviewEmote, string> = {
  like: "👍",
  dislike: "👎",
  smile: "😊",
  sad: "😢",
  angry: "😠",
  fire: "🔥",
  joy: "😂",
  heart: "❤️",
  six_seven: "67",
  mantas: "🐟",
};

const EMOTE_MAP: Record<string, ReviewEmote> = {
  "👍": "like",
  "👎": "dislike",
  "😊": "smile",
  "😢": "sad",
  "😠": "angry",
  "🔥": "fire",
  "😂": "joy",
  "❤️": "heart",
  "67": "six_seven",
  "🐟": "mantas",
};

export function useProfileReviews(
  profileUserId: number | null,
  currentUserId?: number,
) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const transformReviewResponse = useCallback(
    (review: ReviewResponse): Review => {
      const reactionCounts: Record<
        string,
        { count: number; userReacted: boolean }
      > = {};

      review.reviewEmotes?.forEach((emote) => {
        const emoji = EMOJI_MAP[emote.emote];
        if (!emoji) return;

        if (!reactionCounts[emoji]) {
          reactionCounts[emoji] = { count: 0, userReacted: false };
        }
        reactionCounts[emoji].count++;

        if (currentUserId && emote.user.id === currentUserId) {
          reactionCounts[emoji].userReacted = true;
        }
      });

      return {
        id: review.id,
        reviewer: `${review.reviewer.name} ${review.reviewer.last_name}`,
        rating: review.rating,
        comment: review.body || review.title || "",
        date: new Date(review.review_date).toLocaleDateString(),
        item: review.item.name,
        reactions: Object.entries(reactionCounts).map(([emoji, data]) => ({
          emoji,
          count: data.count,
          userReacted: data.userReacted,
        })),
      };
    },
    [currentUserId],
  );

  useEffect(() => {
    const loadReviews = async () => {
      if (!profileUserId) return;

      setIsLoading(true);
      try {
        const reviewsData = await reviewsApi.getUserReviews(profileUserId);
        const transformedReviews: Review[] = reviewsData.map((review) =>
          transformReviewResponse(review),
        );
        setReviews(transformedReviews);
      } catch (error) {
        console.error("Failed to load reviews:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadReviews();
  }, [profileUserId, transformReviewResponse]);

  const toggleReaction = async (reviewId: number, emoji: string) => {
    const review = reviews.find((r) => r.id === reviewId);
    if (!review) return;

    const emote = EMOTE_MAP[emoji];
    if (!emote) return;

    const existingReaction = review.reactions.find((r) => r.emoji === emoji);
    const hasAnyReaction = review.reactions.some((r) => r.userReacted);

    try {
      if (existingReaction?.userReacted) {
        await reviewsApi.removeReaction(reviewId);
        setReviews((prevReviews) =>
          prevReviews.map((r) => {
            if (r.id !== reviewId) return r;
            return {
              ...r,
              reactions: r.reactions
                .map((reaction) =>
                  reaction.emoji === emoji
                    ? {
                        ...reaction,
                        count: reaction.count - 1,
                        userReacted: false,
                      }
                    : reaction,
                )
                .filter((reaction) => reaction.count > 0),
            };
          }),
        );
      } else if (hasAnyReaction) {
        await reviewsApi.addReaction({ reviewId, emote });
        setReviews((prevReviews) =>
          prevReviews.map((r) => {
            if (r.id !== reviewId) return r;
            return {
              ...r,
              reactions: r.reactions
                .map((reaction) => {
                  if (reaction.userReacted) {
                    return {
                      ...reaction,
                      count: reaction.count - 1,
                      userReacted: false,
                    };
                  }
                  if (reaction.emoji === emoji) {
                    return {
                      ...reaction,
                      count: reaction.count + 1,
                      userReacted: true,
                    };
                  }
                  return reaction;
                })
                .filter((reaction) => reaction.count > 0)
                .concat(
                  existingReaction
                    ? []
                    : [{ emoji, count: 1, userReacted: true }],
                ),
            };
          }),
        );
      } else {
        await reviewsApi.addReaction({ reviewId, emote });
        setReviews((prevReviews) =>
          prevReviews.map((r) => {
            if (r.id !== reviewId) return r;

            if (existingReaction) {
              return {
                ...r,
                reactions: r.reactions.map((reaction) =>
                  reaction.emoji === emoji
                    ? {
                        ...reaction,
                        count: reaction.count + 1,
                        userReacted: true,
                      }
                    : reaction,
                ),
              };
            } else {
              return {
                ...r,
                reactions: [
                  ...r.reactions,
                  { emoji, count: 1, userReacted: true },
                ],
              };
            }
          }),
        );
      }
    } catch (error) {
      console.error("Failed to toggle reaction:", error);
    }
  };

  const deleteReview = async (reviewId: number) => {
    try {
      await reviewsApi.deleteReview(reviewId);
      setReviews((prevReviews) =>
        prevReviews.filter((review) => review.id !== reviewId),
      );
    } catch (error) {
      console.error("Failed to delete review:", error);
    }
  };

  return {
    reviews,
    isLoading,
    toggleReaction,
    deleteReview,
  };
}
