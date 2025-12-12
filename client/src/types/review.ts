export type ReviewEmote =
  | "like"
  | "dislike"
  | "smile"
  | "sad"
  | "angry"
  | "fire"
  | "joy"
  | "heart"
  | "six_seven"
  | "mantas";

export interface UserSummary {
  id: number;
  name: string;
  last_name: string;
  avatar?: string;
}

export interface ItemSummary {
  id: number;
  name: string;
  description: string;
}

export interface ReviewEmoteResponse {
  id: number;
  emote: ReviewEmote;
  user: UserSummary;
}

export interface ReviewResponse {
  id: number;
  title?: string;
  body?: string;
  rating: number;
  review_date: string;
  reviewer: UserSummary;
  reviewee: UserSummary;
  item: ItemSummary;
  reviewEmotes?: ReviewEmoteResponse[];
}

export interface CreateReviewDto {
  title?: string;
  body?: string;
  rating: number;
  itemId: number;
  revieweeId: number;
}

export interface CreateReviewEmoteDto {
  reviewId: number;
  emote: ReviewEmote;
}
