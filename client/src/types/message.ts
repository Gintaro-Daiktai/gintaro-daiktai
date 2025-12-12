export interface MessageUser {
  id: number;
  name: string;
  last_name: string;
}

export interface ParentMessage {
  id: number;
  text: string;
  sender: {
    id: number;
    name: string;
  };
}

export interface Message {
  id: number;
  text: string;
  send_date: string;
  sender: MessageUser;
  receiver: MessageUser;
  parentMessage?: ParentMessage | null;
}

export interface CreateMessageData {
  text: string;
  deliveryId: number;
  receiverId: number;
  parentMessageId?: number;
}

export interface MessageReceivedPayload {
  id: number;
  text: string;
  sendDate: string;
  sender: {
    id: number;
    name: string;
    lastName: string;
  };
  receiver: {
    id: number;
    name: string;
    lastName: string;
  };
  parentMessage: {
    id: number;
    text: string;
    sender: {
      id: number;
      name: string;
    };
  } | null;
  deliveryId: number;
}
