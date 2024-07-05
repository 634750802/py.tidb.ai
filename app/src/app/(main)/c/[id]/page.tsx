import { type Chat, type ChatMessage, getChat } from '@/api/chats';
import { Conversation } from '@/components/chat/conversation';
import { auth } from '@/lib/auth';
import { isServerError } from '@/lib/request';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';

const cachedGetChat = cache((id: string) => getChat(id)
  .then(res => {
    return res;
  })
  .catch(error => {
    if (isServerError(error, [404, 422 /* handle not UUID */])) {
      notFound();
    } else {
      return Promise.reject(error);
    }
  }));

export default async function ChatDetailPage ({ params }: { params: { id: string } }) {
  const id = params.id;

  const me = await auth();

  let chat: Chat | undefined;
  let messages: ChatMessage[];

  if (id === 'new') {
    messages = [];
  } else {
    const detail = await cachedGetChat(id);

    chat = detail.chat;
    messages = detail.messages;
  }

  return (
    <div className="xl:pr-side">
      <Conversation
        open={!!me && me.id === chat?.user_id}
        chat={chat}
        history={messages}
        engineOptions={chat?.engine_options ?? {}}
      />
    </div>
  );
}

export async function generateMetadata ({ params }: { params: { id: string } }): Promise<Metadata> {
  if (params.id === 'new') {
    return {
      title: 'Creating chat... | tidb.ai',
    };
  }
  const chat = await cachedGetChat(params.id);

  return {
    title: chat.chat.title,
  };
}
