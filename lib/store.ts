import { create } from "zustand";

type Message = {
  id: number;
  text: string;
  sender: "user" | "ai";
};

type Chat = {
  id: string;
  title: string;
  messages: Message[];
  documentName?: string | null;
};

interface ChatState {
  chats: Chat[];
  activeChatId: string | null;
  isLoading: boolean;
  isMessagesLoading: boolean;
  actions: {
    fetchChats: (userId: string) => Promise<void>;
    fetchMessages: (chatId: string) => Promise<void>;
    startNewChat: () => void;
    setActiveChat: (chatId: string) => void;
    sendMessage: (text: string) => Promise<void>;
    attachDocument: (chatId: string, documentName: string) => void;
    renameChat: (chatId: string, newTitle: string) => void;
    deleteChat: (chatId: string) => void;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  activeChatId: null,
  isLoading: false,
  isMessagesLoading: false,
  actions: {
    fetchChats: async (userId) => {
      if (!API_URL) {
        console.error("API URL is not configured.");
        get().actions.startNewChat();
        return;
      }
      try {
        const response = await fetch(`${API_URL}/chats/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch chats");
        const chatsFromDb = await response.json();

        // Handle the case where no chats exist
        if (chatsFromDb && chatsFromDb.length > 0) {
          const formattedChats: Chat[] = chatsFromDb.map((chat: any) => ({
            id: chat.SK.replace("CHAT#", ""),
            title: chat.Title,
            messages: [],
          }));
          set({ chats: formattedChats, activeChatId: formattedChats[0].id });
          get().actions.fetchMessages(formattedChats[0].id);
        } else {
          // If no chats exist for the user, create a new one
          get().actions.startNewChat();
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
        get().actions.startNewChat();
      }
    },
    fetchMessages: async (chatId) => {
      if (!API_URL) return;
      set({ isMessagesLoading: true });
      try {
        const response = await fetch(`${API_URL}/chats/${chatId}/messages`);
        if (!response.ok) throw new Error("Failed to fetch messages");
        const messagesFromDb = await response.json();

        const formattedMessages: Message[] = messagesFromDb.map((msg: any) => ({
          id: new Date(msg.SK.replace("MESSAGE#", "")).getTime(),
          text: msg.Text,
          sender: msg.Sender.toLowerCase(),
        }));

        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId ? { ...chat, messages: formattedMessages } : chat
          ),
          isMessagesLoading: false,
        }));
      } catch (error) {
        console.error("Error fetching messages:", error);
        set({ isMessagesLoading: false });
      }
    },
    startNewChat: () => {
      const newChatId = Date.now().toString();
      const newChat: Chat = { id: newChatId, title: "New Chat", messages: [] };
      set((state) => ({
        chats: [newChat, ...state.chats],
        activeChatId: newChatId,
      }));
    },
    setActiveChat: (chatId) => {
      const { chats, actions } = get();
      const targetChat = chats.find((c) => c.id === chatId);
      if (targetChat && targetChat.messages.length === 0) {
        actions.fetchMessages(chatId);
      }
      set({ activeChatId: chatId });
    },
    sendMessage: async (text) => {
      const { activeChatId } = get();
      if (!activeChatId || !API_URL) return;
      const userId = "user_placeholder_123";

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

      try {
        const response = await fetch(`${API_URL}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: text,
            chatId: activeChatId,
            userId: userId,
          }),
        });

        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        const aiResponse: Message = {
          id: Date.now() + 1,
          text: data.answer,
          sender: "ai",
        };

        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === activeChatId
              ? { ...chat, messages: [...chat.messages, aiResponse] }
              : chat
          ),
        }));
      } catch (error) {
        console.error("Error fetching AI response:", error);
        const errorResponse: Message = {
          id: Date.now() + 1,
          text: "Sorry, I couldn't connect to the backend.",
          sender: "ai",
        };
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === activeChatId
              ? { ...chat, messages: [...chat.messages, errorResponse] }
              : chat
          ),
        }));
      } finally {
        set({ isLoading: false });
      }
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
    deleteChat: (chatId) => {
      set((state) => {
        const remainingChats = state.chats.filter((chat) => chat.id !== chatId);
        let newActiveChatId = state.activeChatId;
        if (state.activeChatId === chatId) {
          newActiveChatId =
            remainingChats.length > 0 ? remainingChats[0].id : null;
        }
        return { chats: remainingChats, activeChatId: newActiveChatId };
      });
    },
  },
}));
