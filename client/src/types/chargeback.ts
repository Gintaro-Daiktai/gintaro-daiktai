export interface ChargebackDeliveryUser {
  id: number;
  name: string;
  last_name: string;
}

export interface ChargebackDeliveryItem {
  id: number;
  name: string;
  description: string;
}

export interface ChargebackDelivery {
  id: number;
  order_date: string;
  order_status: "processing" | "delivering" | "delivered" | "cancelled";
  item: ChargebackDeliveryItem;
  sender: ChargebackDeliveryUser;
  receiver: ChargebackDeliveryUser;
}

export interface ChargebackRequest {
  id: number;
  reason: string;
  confirmed: boolean | null;
  delivery: ChargebackDelivery;
}

export interface CreateChargebackRequest {
  reason: string;
  delivery: number;
}

export interface UpdateChargebackRequest {
  confirmed: boolean;
}
