'use client';

import ChatLayout from "@/app/components/chat/ChatLayout/ChatLayout";
import { useParams } from 'next/navigation';

export default function ChatDetailPage() {
  const params = useParams();
  const chatId = params.chatId as string;

  return <ChatLayout initialActiveChatId={chatId} />;
}