'use client';

import { useState, useRef, KeyboardEvent, ChangeEvent, FormEvent } from 'react';

interface UseChatMessageInputProps {
  onSendMessage: (payload: { text_content?: string, image_data_url?: string }) => void;
  onStartTyping: () => void;
  onStopTyping: () => void;
}

export const useChatMessageInput = ({
  onSendMessage,
  onStartTyping,
  onStopTyping
}: UseChatMessageInputProps) => {
  const [messageText, setMessageText] = useState('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const stopTyping = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    onStopTyping();
  };

  const handleSendMessage = (e?: FormEvent) => {
    e?.preventDefault();

    const hasText = messageText.trim().length > 0;
    const hasImage = !!imagePreviewUrl;

    if (hasText || hasImage) {
      stopTyping();
      onSendMessage({
        text_content: hasText ? messageText.trim() : undefined,
        image_data_url: hasImage ? imagePreviewUrl : undefined,
      });
      setMessageText('');
      setImagePreviewUrl(null);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessageText(e.target.value);
    if (!typingTimeoutRef.current) {
      onStartTyping();
    } else {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File is too large. Please select a file smaller than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImagePreviewUrl(reader.result as string);
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      alert('Failed to read file.');
    };
    e.target.value = '';
  };

  const removeImagePreview = () => {
    setImagePreviewUrl(null);
  };

  return {
    messageText,
    imagePreviewUrl,
    fileInputRef,
    handleSendMessage,
    handleKeyDown,
    handleInputChange,
    handleAttachClick,
    handleFileChange,
    removeImagePreview,
  };
};