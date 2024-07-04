import type { ChatMessage, ChatMessageSource } from '@/api/chats';
import { EMPTY_CHAT_MESSAGE_ANNOTATION, type MyChatMessageAnnotation } from '@/components/chat/use-grouped-conversation-messages';
import { type JSONValue, Message } from 'ai';

export type ChatEngineOptions = any // TODO;

export function parseSource (uri?: string) {
  if (!uri) {
    return 'Unknown';
  }
  if (/^https:\/\//.test(uri)) {
    return new URL(uri).hostname;
  } else {
    return uri;
  }
}

export function getChatMessageAnnotations (message: Message | undefined) {
  return ((message?.annotations ?? []) as unknown as MyChatMessageAnnotation[])
    .reduce((annotation, next) => Object.assign({}, annotation, next), EMPTY_CHAT_MESSAGE_ANNOTATION);
}

export function createInitialMessages (chatId: string, history: ChatMessage[]): Message[] {
  const contextMap = new Map<number, ChatMessageSource[]>;

  history.forEach(item => {
    let sources = contextMap.get(item.ordinal);
    if (!sources) {
      contextMap.set(item.ordinal, sources = []);
    }
    sources.push(...item.sources);
  });

  return history.map((message, index) => ({
    id: String(message.id),
    role: message.role as any,
    content: message.content,
    annotations: (message.role === 'assistant' ? [
      { chat_id: chatId === 'new' ? undefined : chatId, context: contextMap.get(message.ordinal) ?? [], message_id: message.id, ts: -1 } satisfies MyChatMessageAnnotation,
    ] : undefined) as JSONValue[] | undefined,
  }));
}
