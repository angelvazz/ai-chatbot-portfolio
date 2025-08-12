import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Paperclip } from "lucide-react";
import { useChatStore } from "@/lib/store";

export function ChatInput() {
  const [text, setText] = useState("");
  const isLoading = useChatStore((state) => state.isLoading);
  const activeChatId = useChatStore((state) => state.activeChatId);
  const actions = useChatStore((state) => state.actions);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      actions.sendMessage(text);
      setText("");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && activeChatId) {
      actions.attachDocument(activeChatId, file.name);
    }
  };

  return (
    <form
      onSubmit={handleSendMessage}
      className="relative p-4 border-t border-slate-800"
    >
      <div className="iridescent-border"></div>
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask anything or attach a document..."
        disabled={isLoading}
        className="w-full pr-24"
      />
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="w-5 h-5" />
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf"
        />
        <Button type="submit" size="icon" disabled={isLoading}>
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </form>
  );
}
