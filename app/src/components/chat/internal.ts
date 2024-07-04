import type { useChat } from 'ai/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

const internalState: {
  message: string
} = {
  message: '',
};

export function __setMessage (msg: string) {
  internalState.message = msg;
}

export function __useHandleInitialMessage (isNew: boolean, chat: ReturnType<typeof useChat>, setWaiting: (waiting: boolean) => void) {
  const router = useRouter();
  const handled = useRef(!isNew);

  useEffect(() => {
    if (internalState.message) {
      chat.setMessages([
        { id: 'good-question', content: internalState.message, role: 'user' },
      ]);
      internalState.message = '';
      setWaiting(true);
      chat.reload().finally(() => setWaiting(false));
      handled.current = true;
    }

    if (isNew && !handled.current) {
      router.replace('/');
    }
  });
}
