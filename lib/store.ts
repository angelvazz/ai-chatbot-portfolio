import { create } from "zustand";

type Message = {
  id: number;
  text: string;
  sender: "user" | "ai";
};

type Chat = {
  id: number;
  title: string;
  messages: Message[];
  documentName?: string | null;
};

interface ChatState {
  chats: Chat[];
  activeChatId: number | null;
  isLoading: boolean;
  actions: {
    startNewChat: () => void;
    setActiveChat: (chatId: number) => void;
    sendMessage: (text: string) => void;
    attachDocument: (chatId: number, documentName: string) => void;
    renameChat: (chatId: number, newTitle: string) => void;
    deleteChat: (chatId: number) => void; // <-- NEW ACTION
  };
}

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [{ id: 1, title: "New Chat", messages: [] }],
  activeChatId: 1,
  isLoading: false,
  actions: {
    startNewChat: () => {
      const newChatId = Date.now();
      const newChat: Chat = {
        id: newChatId,
        title: "New Chat",
        messages: [],
      };
      set((state) => ({
        chats: [newChat, ...state.chats],
        activeChatId: newChatId,
      }));
    },
    setActiveChat: (chatId) => {
      set({ activeChatId: chatId });
    },
    sendMessage: (text) => {
      const { activeChatId } = get();
      if (!activeChatId) return;

      const userMessage: Message = { id: Date.now(), text, sender: "user" };

      set((state) => ({
        isLoading: true,
        chats: state.chats.map((chat) => {
          if (chat.id === activeChatId) {
            const newTitle = chat.messages.length === 0 ? text : chat.title;
            return {
              ...chat,
              title: newTitle,
              messages: [...chat.messages, userMessage],
            };
          }
          return chat;
        }),
      }));

      // Simulate AI response
      setTimeout(() => {
        const aiResponse: Message = {
          id: Date.now() + 1,
          text: "This is a simulated response. The real AI would consider the chat history and any attached document.",
          sender: "ai",
        };
        set((state) => ({
          isLoading: false,
          chats: state.chats.map((chat) =>
            chat.id === activeChatId
              ? { ...chat, messages: [...chat.messages, aiResponse] }
              : chat
          ),
        }));
      }, 1500);
    },
    attachDocument: (chatId, documentName) => {
      set((state) => ({
        chats: state.chats.map((chat) =>
          chat.id === chatId ? { ...chat, documentName } : chat
        ),
      }));
    },
    renameChat: (chatId, newTitle) => {
      set((state) => ({
        chats: state.chats.map((chat) =>
          chat.id === chatId ? { ...chat, title: newTitle } : chat
        ),
      }));
    },
    // --- NEW ACTION IMPLEMENTATION ---
    deleteChat: (chatId) => {
      set((state) => {
        const remainingChats = state.chats.filter((chat) => chat.id !== chatId);
        let newActiveChatId = state.activeChatId;
        // If the deleted chat was the active one, set a new active chat
        if (state.activeChatId === chatId) {
          newActiveChatId =
            remainingChats.length > 0 ? remainingChats[0].id : null;
        }
        return { chats: remainingChats, activeChatId: newActiveChatId };
      });
    },
  },
}));
