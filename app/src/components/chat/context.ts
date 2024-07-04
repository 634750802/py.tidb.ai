import type { useMyChat } from '@/components/chat/use-my-chat';
import { createContext, useContext } from 'react';
import type { ChatEngineOptions } from './utils';

const MyChatContext = createContext<ReturnType<typeof useMyChat>>(null as any);
const ChatEngineOptions = createContext<ChatEngineOptions | null>(null);

export const useMyChatContext = () => useContext(MyChatContext);
export const MyChatProvider = MyChatContext.Provider;

export const useChatEngineOptions = () => useContext(ChatEngineOptions);
export const ChatEngineProvider = ChatEngineOptions.Provider;