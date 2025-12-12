import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Loader2, Reply, X } from "lucide-react";
import { NavLink } from "react-router";
import { useSocket } from "@/hooks/useSocket";
import { messagesApi } from "@/api/messages";
import { deliveryApi } from "@/api/delivery";
import type { Message, MessageReceivedPayload } from "@/types/message";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function MessagesPage() {
  const { socket, isConnected } = useSocket();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const deliveryId = 1;
  const [otherUser, setOtherUser] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: behavior,
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);

        // Fetch delivery to get sender/receiver info
        const delivery = await deliveryApi.getDeliveryById(deliveryId);

        // Determine the other user (if current user is sender, other is receiver, and vice versa)
        const otherUserId =
          delivery.sender.id === user.id
            ? delivery.receiver.id
            : delivery.sender.id;

        const otherUserData =
          delivery.sender.id === user.id ? delivery.receiver : delivery.sender;

        setOtherUser({
          id: otherUserId,
          name: `${otherUserData.name} ${otherUserData.last_name}`,
        });

        // Fetch messages
        const fetchedMessages =
          await messagesApi.getMessagesByDeliveryId(deliveryId);
        setMessages(fetchedMessages);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load delivery information");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData().then(() => {
      // Scroll to bottom after initial messages load (instant, no animation)
      setTimeout(() => scrollToBottom("auto"), 100);
    });
  }, [deliveryId, user]);

  // Setup WebSocket listeners
  useEffect(() => {
    if (!socket || !isConnected) {
      return;
    }

    socket.emit("joinDelivery", { deliveryId });

    // Listen for new messages
    socket.on("messageReceived", (payload: MessageReceivedPayload) => {
      // Convert the payload to our Message format
      const newMessage: Message = {
        id: payload.id,
        text: payload.text,
        send_date: payload.sendDate,
        sender: {
          id: payload.sender.id,
          name: payload.sender.name,
          last_name: payload.sender.lastName,
        },
        receiver: {
          id: payload.receiver.id,
          name: payload.receiver.name,
          last_name: payload.receiver.lastName,
        },
        parentMessage: payload.parentMessage,
      };

      setMessages((prev) => [...prev, newMessage]);

      setTimeout(() => scrollToBottom(), 100);
    });

    // Listen for message sent confirmation
    socket.on("messageSent", (data) => {
      console.log("Message sent successfully:", data);
      setIsSending(false);
    });

    // Listen for errors
    socket.on("error", (error) => {
      console.error("Socket error:", error);
      toast.error(error.message || "An error occurred");
      setIsSending(false);
    });

    return () => {
      socket.off("joinedDelivery");
      socket.off("messageReceived");
      socket.off("messageSent");
      socket.off("error");
    };
  }, [socket, isConnected, deliveryId, otherUser, user]);

  const handleSendMessage = () => {
    if (
      !messageInput.trim() ||
      !socket ||
      !isConnected ||
      !otherUser ||
      !user
    ) {
      if (!isConnected) {
        toast.error("Not connected to server");
      } else if (!otherUser) {
        toast.error("Cannot determine recipient");
      }
      return;
    }

    setIsSending(true);

    const messageData: {
      text: string;
      deliveryId: number;
      receiverId: number;
      parentMessageId?: number;
    } = {
      text: messageInput.trim(),
      deliveryId: deliveryId,
      receiverId: otherUser.id,
    };

    // Add parent message ID if replying
    if (replyingTo) {
      messageData.parentMessageId = replyingTo.id;
    }

    console.log("Sending message:", messageData);
    socket.emit("sendMessage", messageData);

    // Clear input and reply state immediately for better UX
    setMessageInput("");
    setReplyingTo(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 container py-12">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">
              Please log in to view messages
            </h1>
            <Button asChild>
              <NavLink to="/login">Log In</NavLink>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container py-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <NavLink to="/deliveries">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </NavLink>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">Messages</h1>
              <p className="text-sm text-muted-foreground">
                Delivery #{deliveryId}{" "}
                {isConnected ? "• Connected" : "• Disconnected"}
              </p>
            </div>
          </div>

          {/* Chat Card */}
          <Card className="flex flex-col h-[calc(100vh-200px)]">
            {/* Header */}
            <CardHeader className="pb-4 border-b">
              <div>
                <CardTitle className="text-lg">
                  {otherUser ? otherUser.name : "Loading..."}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Delivery #{deliveryId}
                </p>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto space-y-4 py-4"
            >
              {isLoading ? (
                <div className="text-center text-muted-foreground py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                  Loading messages...
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                <>
                  {messages.map((message) => {
                    const isCurrentUser = message.sender.id === user.id;
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} group`}
                      >
                        <div className="flex items-end gap-2">
                          {!isCurrentUser && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => setReplyingTo(message)}
                              title="Reply"
                            >
                              <Reply className="h-3 w-3" />
                            </Button>
                          )}
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              isCurrentUser
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {message.parentMessage && (
                              <div className="text-xs opacity-70 border-l-2 pl-2 mb-2">
                                <p className="font-semibold">
                                  {message.parentMessage.sender.name}
                                </p>
                                <p>{message.parentMessage.text}</p>
                              </div>
                            )}
                            <p className="text-sm break-words">
                              {message.text}
                            </p>
                            <p className="text-xs mt-1 opacity-70">
                              {new Date(message.send_date).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </p>
                          </div>
                          {isCurrentUser && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => setReplyingTo(message)}
                              title="Reply"
                            >
                              <Reply className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </CardContent>

            {/* Input */}
            <div className="border-t p-4">
              {replyingTo && (
                <div className="mb-2 p-2 bg-muted rounded-lg flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Reply className="h-3 w-3" />
                      <p className="text-xs font-semibold">
                        Replying to{" "}
                        {replyingTo.sender.id === user.id
                          ? "yourself"
                          : `${replyingTo.sender.name} ${replyingTo.sender.last_name}`}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {replyingTo.text}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 flex-shrink-0"
                    onClick={() => setReplyingTo(null)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  placeholder={
                    isConnected
                      ? "Type a message..."
                      : "Connecting to server..."
                  }
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={!isConnected || isSending}
                />
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() || !isConnected || isSending}
                >
                  {isSending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
