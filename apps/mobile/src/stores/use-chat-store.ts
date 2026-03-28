import { create } from 'zustand';

import type { ChatMessage } from '@/src/lib/mock-data';
import { initialMessages } from '@/src/lib/mock-data';

interface ChatState {
  messages: ChatMessage[];
  appendUser: (text: string) => void;
  appendAssistant: (text: string) => void;
  reset: () => void;
}

let idCounter = 100;

export const useChatStore = create<ChatState>((set) => ({
  messages: [...initialMessages],
  appendUser: (text) => {
    const m: ChatMessage = {
      id: `u-${++idCounter}`,
      role: 'user',
      content: text,
      time: 'Now',
    };
    set((state) => ({ messages: [...state.messages, m] }));
    setTimeout(() => {
      const reply: ChatMessage = {
        id: `a-${++idCounter}`,
        role: 'assistant',
        time: 'Now',
        content:
          'On it. I’m correlating that with your last 30 fills and vol regime — in production this streams from the inference plane. For the demo: your discipline score improves when you wait for VWAP reclaim after two stops.',
      };
      set((state) => ({ messages: [...state.messages, reply] }));
    }, 600);
  },
  appendAssistant: (text) => {
    set((state) => ({
      messages: [...state.messages, { id: `a-${++idCounter}`, role: 'assistant', content: text, time: 'Now' }],
    }));
  },
  reset: () => set({ messages: [...initialMessages] }),
}));
