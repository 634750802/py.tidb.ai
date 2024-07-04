import { BASE_URL, buildUrlParams, handleErrors, handleResponse, opaqueCookieHeader, type Page, type PageParams, zodPage } from '@/lib/request';
import { zodJsonDate } from '@/lib/zod';
import { z } from 'zod';

export interface Chat {
  title: string;
  engine_id: number;
  engine_options: object;
  deleted_at: Date | null;
  user_id: string | null;
  updated_at: Date;
  created_at: Date;
  id: string;
}

export interface ChatDetail {
  chat: Chat;
  messages: ChatMessage[];
}

export const enum ChatMessageRole {
  assistant = 'assistant',
  user = 'user'
}

export interface ChatMessage {
  id: number;
  role: ChatMessageRole;
  error: string | null;
  trace_url: string | null;
  finished_at: Date | null;
  user_id: string | null;
  created_at: Date;
  updated_at: Date;
  ordinal: number;
  content: string;
  sources: ChatMessageSource[];
  chat_id: string;
}

export interface ChatMessageSource {
  id: number;
  name: string;
  source_uri: string;
}

const chatSchema = z.object({
  title: z.string(),
  engine_id: z.number(),
  engine_options: z.string().transform(value => JSON.parse(value) as object),
  deleted_at: zodJsonDate().nullable(),
  user_id: z.string().nullable(),
  updated_at: zodJsonDate(),
  created_at: zodJsonDate(),
  id: z.string(),
});

const chatMessageSourceSchema = z.object({
  id: z.number(),
  name: z.string(),
  source_uri: z.string(),
});

const chatMessageSchema = z.object({
  id: z.number(),
  role: z.enum([ChatMessageRole.user, ChatMessageRole.assistant]),
  error: z.string().nullable(),
  trace_url: z.string().nullable(),
  finished_at: zodJsonDate().nullable(),
  user_id: z.string().nullable(),
  created_at: zodJsonDate(),
  updated_at: zodJsonDate(),
  ordinal: z.number(),
  content: z.string(),
  sources: chatMessageSourceSchema.array(),
  chat_id: z.string(),
});

const chatDetailSchema = z.object({
  chat: chatSchema,
  messages: chatMessageSchema.array(),
});

export interface FeedbackParams {
  feedback_type: 'like' | 'dislike';
  comment: string;
}

export async function listChats ({ page = 1, size = 10 }: PageParams = {}): Promise<Page<Chat>> {
  return await fetch(BASE_URL + '/api/v1/chats' + '?' + buildUrlParams({ page, size }), {
    headers: await opaqueCookieHeader(),
  })
    .then(handleResponse(zodPage(chatSchema)));
}

export async function getChat (id: string): Promise<ChatDetail> {
  return await fetch(BASE_URL + `/api/v1/chats/${id}`, {
    headers: await opaqueCookieHeader(),
  })
    .then(handleResponse(chatDetailSchema));
}

export async function deleteChat (id: string): Promise<void> {
  await fetch(BASE_URL + `/api/v1/chats/${id}`, {
    method: 'delete',
  }).then(handleErrors);
}

export async function postFeedback (chatMessageId: number, feedback: FeedbackParams) {
  return await fetch(BASE_URL + `/api/v1/chat-messages/${chatMessageId}/feedback`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(feedback),
  }).then(handleErrors);
}
