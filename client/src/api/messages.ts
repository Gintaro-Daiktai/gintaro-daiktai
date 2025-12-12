import { apiClient } from "./client";
import type { Message } from "@/types/message";

export const messagesApi = {
  getMessagesByDeliveryId: async (deliveryId: number): Promise<Message[]> => {
    const messages = await apiClient<Message[]>(
      `/messages/delivery/${deliveryId}`,
      {
        method: "GET",
        requiresAuth: true,
      },
    );
    return messages;
  },

  getMessageById: async (messageId: number): Promise<Message> => {
    const message = await apiClient<Message>(`/messages/${messageId}`, {
      method: "GET",
      requiresAuth: true,
    });
    return message;
  },
};
