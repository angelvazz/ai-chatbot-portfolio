import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, MessageSquare, Pencil, Trash2 } from "lucide-react";
import { useChatStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// We define the Chat type here as well for type safety in this component
type Chat = {
  id: number;
  title: string;
  messages: any[];
};

export function Sidebar() {
  const chats = useChatStore((state) => state.chats);
  const activeChatId = useChatStore((state) => state.activeChatId);
  const actions = useChatStore((state) => state.actions);

  const [editingChatId, setEditingChatId] = useState<number | null>(null);
  const [hoveredChatId, setHoveredChatId] = useState<number | null>(null);
  const [tempTitle, setTempTitle] = useState("");

  const handleRename = (chatId: number, currentTitle: string) => {
    setEditingChatId(chatId);
    setTempTitle(currentTitle);
  };

  const handleSaveRename = (chatId: number) => {
    if (tempTitle.trim()) {
      actions.renameChat(chatId, tempTitle.trim());
    }
    setEditingChatId(null);
  };

  const getChatTitle = (chat: Chat) => {
    return chat.messages.length > 0 && chat.title === "New Chat"
      ? chat.messages[0].text
      : chat.title;
  };

  return (
    <aside className="w-[300px] p-4 border-r border-slate-800 flex flex-col">
      <Button onClick={actions.startNewChat} className="w-full cursor-pointer">
        <PlusCircle className="w-4 h-4 mr-2" />
        New Chat
      </Button>
      <div className="flex-grow mt-4 overflow-y-auto">
        <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
          Chat History
        </p>
        <div className="space-y-1">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onMouseEnter={() => setHoveredChatId(chat.id)}
              onMouseLeave={() => setHoveredChatId(null)}
              className={cn(
                "w-full text-left p-2 rounded-md text-sm transition-colors flex items-center justify-between cursor-pointer group",
                activeChatId === chat.id
                  ? "bg-slate-700 text-white"
                  : "hover:bg-slate-800"
              )}
            >
              <div
                className="flex items-center truncate flex-grow"
                onClick={() => actions.setActiveChat(chat.id)}
              >
                <MessageSquare className="w-4 h-4 mr-2 shrink-0" />
                {editingChatId === chat.id ? (
                  <Input
                    type="text"
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    onBlur={() => handleSaveRename(chat.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveRename(chat.id);
                      if (e.key === "Escape") setEditingChatId(null);
                    }}
                    className="h-7 text-sm"
                    autoFocus
                  />
                ) : (
                  <span className="truncate">{getChatTitle(chat)}</span>
                )}
              </div>
              <div
                className={cn(
                  "flex items-center shrink-0",
                  hoveredChatId === chat.id ? "opacity-100" : "opacity-0",
                  "group-hover:opacity-100 transition-opacity"
                )}
              >
                {editingChatId !== chat.id && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 cursor-pointer"
                      onClick={() => handleRename(chat.id, getChatTitle(chat))}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-slate-900 text-slate-50 border-slate-700">
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the chat titled: <br />
                            <strong className="text-white mt-2 block">
                              "{getChatTitle(chat)}"
                            </strong>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          {/* CORRECTED: Added explicit hover classes and transitions */}
                          <AlertDialogCancel className="transition-colors hover:bg-slate-800 cursor-pointer">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-destructive-foreground transition-colors hover:bg-slate-800 cursor-pointer"
                            onClick={() => actions.deleteChat(chat.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
