import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { getToken } from "@/utils/token";
import { useAuth } from "@/hooks/useAuth";
import { SocketContext } from "./SocketContext";

interface SocketProviderProps {
  children: React.ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Wait for auth to finish loading
    if (isLoading) {
      return;
    }

    // If not authenticated, don't connect
    if (!isAuthenticated) {
      // Cleanup existing socket if any
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
        setConnectionAttempts(0);
      }
      return;
    }

    // Don't create new socket if one already exists
    if (socket) {
      return;
    }

    const token = getToken();

    if (!token) {
      console.log("No token available, skipping socket connection");
      return;
    }

    const BACKEND_URL =
      import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

    console.log("Initializing socket connection to:", BACKEND_URL);
    const socketInstance = io(BACKEND_URL, {
      auth: {
        token,
      },
      query: {
        token,
      },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 10000,
      reconnectionAttempts: 3,
      timeout: 10000,
    });

    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);
      setIsConnected(true);
      setConnectionAttempts(0);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (error) => {
      setConnectionAttempts((prev) => prev + 1);
      console.error("Socket connection error:", error.message);
      setIsConnected(false);

      // Stop trying after 3 failed attempts
      if (connectionAttempts >= 2) {
        console.log("Max connection attempts reached, giving up");
        socketInstance.close();
      }
    });

    socketInstance.on("reconnect_failed", () => {
      console.error("Socket reconnection failed after all attempts");
      socketInstance.close();
    });

    socketInstance.on("error", (error) => {
      console.error("Socket error:", error);
    });

    setSocket(socketInstance);

    return () => {
      console.log("Cleaning up socket connection");
      socketInstance.disconnect();
      socketInstance.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isLoading]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}
