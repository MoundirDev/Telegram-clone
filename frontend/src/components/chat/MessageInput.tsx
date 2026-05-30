'use client';

import { useEffect, useRef, useState } from 'react';
import { IconAttach, IconSend, IconSmile } from '@/components/ui/Icons';
import EmojiPicker from '@/components/ui/EmojiPicker';
import clsx from 'clsx';

interface MessageInputProps {
  onSendMessage: (content: string, files?: File[]) => void;
  isSending: boolean;
}

export default function MessageInput({ onSendMessage, isSending }: MessageInputProps) {
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 160) + 'px';
    }
  }, [content]);

  const canSend = (content.trim() || files.length > 0) && !isSending;

  const insertEmoji = (emoji: string) => {
    const el = textareaRef.current;
    if (!el) {
      setContent(c => c + emoji);
      return;
    }
    const start = el.selectionStart ?? content.length;
    const end = el.selectionEnd ?? content.length;
    const next = content.slice(0, start) + emoji + content.slice(end);
    setContent(next);
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + emoji.length;
      el.setSelectionRange(pos, pos);
    });
  };

  const handleSend = () => {
    if (!canSend) return;
    onSendMessage(content.trim(), files.length > 0 ? files : undefined);
    setContent('');
    setFiles([]);
    setEmojiOpen(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    setFiles(prev => [...prev, ...selected]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <footer className="relative w-full px-3 py-2 bg-tg-sidebar shrink-0">
      {files.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2 px-1">
          {files.map((file, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 bg-tg-search-bg text-sm text-tg-title rounded-full pl-3 pr-2 py-1"
            >
              {file.name}
              <button
                type="button"
                onClick={() => setFiles(files.filter((_, i) => i !== index))}
                className="w-5 h-5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-tg-muted"
                aria-label={`Remove ${file.name}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex items-end gap-1">
        <div className="relative flex-shrink-0 mb-0.5">
          <button
            type="button"
            onClick={() => setEmojiOpen(v => !v)}
            className={clsx('tg-btn-icon', emojiOpen && 'bg-tg-hover text-tg-blue')}
            aria-label="Emoji"
            aria-expanded={emojiOpen}
          >
            <IconSmile />
          </button>
          <EmojiPicker
            open={emojiOpen}
            onClose={() => setEmojiOpen(false)}
            onSelect={insertEmoji}
          />
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="tg-btn-icon flex-shrink-0 mb-0.5"
          aria-label="Attach file"
        >
          <IconAttach className="w-[22px] h-[22px] rotate-45 text-tg-muted" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt"
        />

        <div className="flex-1 flex items-end bg-tg-search-bg rounded-2xl border border-transparent focus-within:border-tg-blue/40 min-h-[44px]">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={e => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message"
            rows={1}
            className="flex-1 bg-transparent px-4 py-2.5 text-[15px] text-tg-title placeholder:text-tg-muted outline-none resize-none max-h-40"
          />
        </div>

        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          className={clsx(
            'flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center mb-0.5 transition-all',
            canSend
              ? 'bg-tg-blue text-white hover:bg-tg-blue-hover shadow-md'
              : 'text-tg-muted cursor-default'
          )}
          aria-label="Send"
        >
          <IconSend className={clsx('w-5 h-5', canSend && 'ml-0.5')} />
        </button>
      </div>
    </footer>
  );
}
