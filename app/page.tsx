"use client";

import { Sidebar } from "@/components/chatbot/Sidebar";
import { ChatMessages } from "@/components/chatbot/ChatMessages";
import { ChatInput } from "@/components/chatbot/ChatInput";

export default function Home() {
  return (
    <div className="flex h-screen bg-slate-950 text-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <ChatMessages />
        <ChatInput />
      </main>
    </div>
  );
}
