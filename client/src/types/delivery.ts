export interface DeliveryUser {
  id: number;
  name: string;
  last_name: string;
}

export interface DeliveryItem {
  id: number;
  name: string;
  description: string;
}

export interface Delivery {
  id: number;
  order_date: string;
  order_status: "processing" | "delivering" | "delivered" | "cancelled";
  item: DeliveryItem;
  sender: DeliveryUser;
  receiver: DeliveryUser;
}
