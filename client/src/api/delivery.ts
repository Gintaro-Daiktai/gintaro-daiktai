import { apiClient } from "./client";
import type { Delivery } from "@/types/delivery";

export const deliveryApi = {
  getDeliveryById: async (id: number): Promise<Delivery> => {
    const delivery = await apiClient<Delivery>(`/deliveries/${id}`, {
      method: "GET",
      requiresAuth: true,
    });
    return delivery;
  },

  getMyDeliveries: async (): Promise<Delivery[]> => {
    const deliveries = await apiClient<Delivery[]>(
      "/deliveries/my-deliveries",
      {
        method: "GET",
        requiresAuth: true,
      },
    );
    return deliveries;
  },

  updateDeliveryStatus: async (
    id: number,
    status: "processing" | "delivering" | "delivered" | "cancelled",
  ): Promise<Delivery> => {
    const delivery = await apiClient<Delivery>(`/deliveries/${id}`, {
      method: "PUT",
      requiresAuth: true,
      body: JSON.stringify({
        delivery: {
          order_status: status,
        },
      }),
    });
    return delivery;
  },
};
