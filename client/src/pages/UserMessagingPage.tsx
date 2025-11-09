import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send, Search } from "lucide-react"
import { NavLink } from "react-router"


interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: Date
}

interface Conversation {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  itemName: string
  itemId: string
  lastMessage?: string
  lastMessageTime?: Date
  unreadCount: number
  messages: Message[]
}

export default function MessagesPage({
  searchParams,
}: {
  searchParams: { userId: string }
}) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(searchParams.userId || null)
  const [messageInput, setMessageInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // TODO: Replace with your actual data fetching logic
  useEffect(() => {
    const fetchConversations = async () => {
      setIsLoading(true)
      try {
        // Mock data - replace with actual API call
        const mockConversations: Conversation[] = [
          {
            id: "1",
            userId: "seller-1",
            userName: "John Collector",
            itemName: "Vintage Rolex Watch",
            itemId: "1",
            lastMessage: "When can you ship?",
            lastMessageTime: new Date(Date.now() - 3600000),
            unreadCount: 2,
            messages: [
              {
                id: "m1",
                senderId: "seller-1",
                senderName: "Džonas Collectoru",
                content: "Hi, I won your auction!",
                timestamp: new Date(Date.now() - 7200000),
              },
              {
                id: "m2",
                senderId: "current-user",
                senderName: "You",
                content: "Great! Thanks for winning. When can you pay?",
                timestamp: new Date(Date.now() - 5400000),
              },
              {
                id: "m3",
                senderId: "seller-1",
                senderName: "John Collector",
                content: "When can you ship?",
                timestamp: new Date(Date.now() - 3600000),
              },
            ],
          },
          {
            id: "2",
            userId: "seller-2",
            userName: "Sarah Gaming",
            itemName: "PlayStation 5 Bundle",
            itemId: "2",
            lastMessage: "Perfect, see you soon!",
            lastMessageTime: new Date(Date.now() - 86400000),
            unreadCount: 0,
            messages: [],
          },
        ]
        setConversations(mockConversations)
      } catch (error) {
        console.error("Error fetching conversations:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchConversations()
  }, [])

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId)

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.itemName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return

    // TODO: Replace with your actual message sending logic
    try {
      console.log("Sending message:", messageInput)
      console.log("To conversation:", selectedConversation.id)

      // Reset input after sending
      setMessageInput("")
    } catch (error) {
      console.error("Error sending message:", error)
    }
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
            <h1 className="text-3xl font-bold">Messages</h1>
          </div>

          {/* Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conversations List */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Conversations</CardTitle>
                <div className="relative mt-4">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {isLoading ? (
                  <div className="text-center text-muted-foreground py-8">Loading...</div>
                ) : filteredConversations.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">No conversations found</div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => setSelectedConversationId(conversation.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedConversationId === conversation.id
                          ? "bg-primary/10 border border-primary/30"
                          : "hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{conversation.userName}</p>
                          <p className="text-xs text-muted-foreground truncate">{conversation.itemName}</p>
                          {conversation.lastMessage && (
                            <p className="text-xs text-muted-foreground truncate mt-1">{conversation.lastMessage}</p>
                          )}
                        </div>
                        {conversation.unreadCount > 0 && (
                          <div className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                            {conversation.unreadCount}
                          </div>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Chat Area */}
            {selectedConversation ? (
              <Card className="lg:col-span-2 flex flex-col">
                {/* Header */}
                <CardHeader className="pb-4 border-b">
                  <div>
                    <CardTitle className="text-lg">{selectedConversation.userName}</CardTitle>
                    <p className="text-sm text-muted-foreground">{selectedConversation.itemName}</p>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto space-y-4 py-4">
                  {selectedConversation.messages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      No messages yet. Start the conversation!
                    </div>
                  ) : (
                    selectedConversation.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === "current-user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.senderId === "current-user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs mt-1 opacity-70">{message.timestamp.toLocaleTimeString()}</p>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>

                {/* Input */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleSendMessage()
                        }
                      }}
                    />
                    <Button size="icon" onClick={handleSendMessage} disabled={!messageInput.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="lg:col-span-2 flex items-center justify-center">
                <CardContent className="text-center text-muted-foreground py-16">
                  <p>Select a conversation to start messaging</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}