import React, { useRef, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useChatStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ChatMessages() {
  const chats = useChatStore((state) => state.chats);
  const activeChatId = useChatStore((state) => state.activeChatId);
  const activeChat = chats.find((chat) => chat.id === activeChatId);
  const messages = activeChat?.messages || [];
  const isLoading = useChatStore((state) => state.isLoading);
  const isMessagesLoading = useChatStore((state) => state.isMessagesLoading);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Loading chat history...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {messages.length === 0 && !isLoading ? (
        <div className="flex h-full flex-col items-center justify-center text-center">
          <h2 className="text-2xl font-bold text-slate-300">AI Chatbot</h2>
          <p className="text-muted-foreground">
            Start a conversation or attach a document to begin.
          </p>
        </div>
      ) : (
        messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex items-start gap-4",
              msg.sender === "user" && "justify-end"
            )}
          >
            {msg.sender === "ai" && (
              <Avatar>
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
            )}
            <div
              className={cn(
                "relative max-w-[75%] rounded-lg p-3 text-sm",
                msg.sender === "user"
                  ? "bg-gradient-to-br from-purple-600 to-blue-500 text-primary-foreground user-bubble"
                  : "bg-slate-800 ai-bubble"
              )}
            >
              {msg.text}
            </div>
            {msg.sender === "user" && (
              <Avatar>
                <AvatarFallback>YOU</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))
      )}
      {isLoading && (
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div className="bg-slate-800 rounded-lg p-3 flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Thinking...</span>
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
