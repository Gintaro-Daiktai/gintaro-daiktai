import { apiClient } from "./client";
import type {
  ReviewResponse,
  ReviewEmoteResponse,
  CreateReviewDto,
  CreateReviewEmoteDto,
} from "@/types/review";

export const reviewsApi = {
  createReview: async (data: CreateReviewDto): Promise<ReviewResponse> => {
    return await apiClient<ReviewResponse>("/reviews", {
      method: "POST",
      body: JSON.stringify(data),
      requiresAuth: true,
    });
  },

  deleteReview: async (reviewId: number): Promise<{ message: string }> => {
    return await apiClient<{ message: string }>(`/reviews/${reviewId}`, {
      method: "DELETE",
      requiresAuth: true,
    });
  },

  getUserReviews: async (userId: number): Promise<ReviewResponse[]> => {
    return await apiClient<ReviewResponse[]>(`/reviews/user/${userId}`, {
      method: "GET",
    });
  },

  getReviewById: async (reviewId: number): Promise<ReviewResponse> => {
    return await apiClient<ReviewResponse>(`/reviews/${reviewId}`, {
      method: "GET",
    });
  },

  addReaction: async (
    data: CreateReviewEmoteDto,
  ): Promise<ReviewEmoteResponse> => {
    return await apiClient<ReviewEmoteResponse>("/review-emotes", {
      method: "POST",
      body: JSON.stringify(data),
      requiresAuth: true,
    });
  },

  removeReaction: async (reviewId: number): Promise<{ message: string }> => {
    return await apiClient<{ message: string }>(`/review-emotes/${reviewId}`, {
      method: "DELETE",
      requiresAuth: true,
    });
  },

  getReviewReactions: async (
    reviewId: number,
  ): Promise<ReviewEmoteResponse[]> => {
    return await apiClient<ReviewEmoteResponse[]>(
      `/review-emotes/${reviewId}`,
      {
        method: "GET",
      },
    );
  },
};
