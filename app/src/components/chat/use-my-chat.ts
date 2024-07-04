import type { ChatMessage } from '@/api/chats';
import { __useHandleInitialMessage } from '@/components/chat/internal';
import { createInitialMessages, getChatMessageAnnotations } from '@/components/chat/utils';
import type { ChatRequestOptions } from 'ai';
import { useChat } from 'ai/react';
import { useRouter } from 'next/navigation';
import { type FormEvent, useEffect, useMemo, useRef, useState } from 'react';

export function useMyChat (id: string, history: ChatMessage[]) {
  const router = useRouter();
  const [isWaiting, setWaiting] = useState(false);

  const isNew = useRef(id === 'new');

  const initialMessages = useMemo(() => {
    return createInitialMessages(id, history);
  }, [id, history]);

  const chat = useChat({
    api: '/api/v1/chats',
    body: {
      chat_id: id === 'new' ? undefined : id,
      chat_engine: 'default',
      stream: true,
    },
    key: isNew ? 'new' : id,
    initialMessages,
    onResponse: response => {
      setWaiting(false);
    },
  });

  __useHandleInitialMessage(id === 'new', chat, setWaiting);

  useEffect(() => {
    if (id === 'new') {
      for (let message of chat.messages) {
        if (message.role === 'assistant') {
          if (message.annotations) {
            for (let annotation of message.annotations) {
              if (annotation && typeof annotation === 'object' && 'chat_id' in annotation && typeof annotation.chat_id === 'string') {
                router.replace(`/c/${annotation.chat_id}`);
                return;
              }
            }
          }
        }
      }
    }
  }, [id, chat.messages]);

  return {
    id,
    ...chat,
    isWaiting,
    handleSubmit: (e: FormEvent<HTMLFormElement>, chatRequestOptions?: ChatRequestOptions) => {
      setWaiting(true);
      chat.handleSubmit(e, chatRequestOptions);
    },
    handleRegenerate: (messageId: string) => {
      const regeneratingMessageIndex = chat.messages.findIndex(msg => msg.id === messageId);
      if (regeneratingMessageIndex === -1) {
        throw new Error('Failed to regenerate');
      }

      const regeneratingMessage = chat.messages[regeneratingMessageIndex];

      if (chat.messages[regeneratingMessageIndex].role !== 'assistant') {
        throw new Error('Only support to regenerate assistant message');
      }

      chat.setMessages(chat.messages.slice(0, regeneratingMessageIndex));

      void chat.reload({
        options: {
          body: {
            regenerate: true,
            messageId: getChatMessageAnnotations(regeneratingMessage).message_id,
          },
        },
      });
    },
  };
}
