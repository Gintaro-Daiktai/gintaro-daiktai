import { apiClient } from "./client";
import type {
  ChargebackRequest,
  CreateChargebackRequest,
  UpdateChargebackRequest,
} from "@/types/chargeback";

export const chargebackApi = {
  getAllChargebackRequests: async (): Promise<ChargebackRequest[]> => {
    const chargebacks = await apiClient<ChargebackRequest[]>(
      "/chargeback-requests",
      {
        method: "GET",
        requiresAuth: true,
      },
    );
    return chargebacks;
  },

  getChargebackRequestById: async (id: number): Promise<ChargebackRequest> => {
    const chargeback = await apiClient<ChargebackRequest>(
      `/chargeback-requests/${id}`,
      {
        method: "GET",
        requiresAuth: true,
      },
    );
    return chargeback;
  },

  createChargebackRequest: async (
    data: CreateChargebackRequest,
  ): Promise<ChargebackRequest> => {
    const chargeback = await apiClient<ChargebackRequest>(
      "/chargeback-requests",
      {
        method: "POST",
        requiresAuth: true,
        body: JSON.stringify({ chargeback_request: data }),
      },
    );
    return chargeback;
  },

  resolveChargebackRequest: async (
    id: number,
    data: UpdateChargebackRequest,
  ): Promise<ChargebackRequest> => {
    const chargeback = await apiClient<ChargebackRequest>(
      `/chargeback-requests/${id}/resolve`,
      {
        method: "PUT",
        requiresAuth: true,
        body: JSON.stringify({ chargeback_request: data }),
      },
    );
    return chargeback;
  },
};
