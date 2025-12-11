export interface DeliveryUser {
  id: number;
  name: string;
  last_name: string;
  email: string;
}

export interface DeliveryItem {
  id: number;
  name: string;
  description: string;
}

export interface Delivery {
  id: number;
  start_date: string;
  delivery_deadline: string;
  order_status: "processing" | "delivering" | "delivered" | "cancelled";
  item: DeliveryItem;
  sender: DeliveryUser;
  receiver: DeliveryUser;
}
