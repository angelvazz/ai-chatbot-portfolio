"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/chatbot/Sidebar";
import { ChatMessages } from "@/components/chatbot/ChatMessages";
import { ChatInput } from "@/components/chatbot/ChatInput";
import { Button } from "@/components/ui/button";
import { PanelLeft, PanelRight } from "lucide-react";
import { useChatStore } from "@/lib/store";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const fetchChats = useChatStore((state) => state.actions.fetchChats);

  useEffect(() => {
    const userId = "angel-test";
    fetchChats(userId);
  }, [fetchChats]);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-50">
      <Button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        size="icon"
        variant="ghost"
        className="absolute top-4 left-4 z-50"
      >
        {isSidebarOpen ? <PanelLeft /> : <PanelRight />}
      </Button>

      <Sidebar isOpen={isSidebarOpen} />

      <main className="flex-1 flex flex-col">
        <ChatMessages />
        <ChatInput />
      </main>
    </div>
  );
}
