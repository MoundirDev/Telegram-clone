'use client';

import { Message } from '@/types';
import { useAuthStore } from '@/lib/store';
import { formatMessageTime } from '@/lib/chatUtils';
import clsx from 'clsx';

interface MessageBubbleProps {
  message: Message;
  showSenderName?: boolean;
  isGroupedWithPrev?: boolean;
  isGroupedWithNext?: boolean;
}

function ReadChecks() {
  return (
    <svg className="w-4 h-3.5" viewBox="0 0 16 11" fill="currentColor" aria-hidden>
      <path d="M11.071.653a.457.457 0 0 0-.304-.102.493.493 0 0 0-.381.178l-6.19 8.18-2.1-2.52a.502.502 0 0 0-.38-.178.457.457 0 0 0-.304.102.493.493 0 0 0-.102.685l2.52 3.02a.5.5 0 0 0 .762-.063l6.59-8.72a.493.493 0 0 0-.115-.602z" />
      <path d="M15.071.653a.457.457 0 0 0-.304-.102.493.493 0 0 0-.381.178l-6.19 8.18-2.1-2.52a.502.502 0 0 0-.38-.178.457.457 0 0 0-.304.102.493.493 0 0 0-.102.685l2.52 3.02a.5.5 0 0 0 .762-.063l6.59-8.72a.493.493 0 0 0-.115-.602z" />
    </svg>
  );
}

export default function MessageBubble({
  message,
  showSenderName,
  isGroupedWithPrev,
  isGroupedWithNext,
}: MessageBubbleProps) {
  const { user } = useAuthStore();
  const isOwn = message.senderId.id === user?.id;

  const bubbleRadius = () => {
    if (isOwn) {
      return clsx(
        'rounded-[18px]',
        !isGroupedWithPrev && 'rounded-br-[4px]',
        !isGroupedWithNext && 'rounded-tr-[4px]'
      );
    }
    return clsx(
      'rounded-[18px]',
      !isGroupedWithPrev && 'rounded-bl-[4px]',
      !isGroupedWithNext && 'rounded-tl-[4px]'
    );
  };

  return (
    <div
      className={clsx(
        'flex w-full',
        isOwn ? 'justify-end' : 'justify-start',
        isGroupedWithPrev ? 'mt-[2px]' : 'mt-1'
      )}
    >
      <div
        className={clsx(
          'w-fit max-w-[min(420px,85vw)] shadow-bubble',
          isOwn ? 'bg-tg-outgoing text-tg-outgoing-text' : 'bg-tg-incoming text-tg-incoming-text',
          bubbleRadius()
        )}
      >
        {showSenderName && !isOwn && (
          <p className="text-[13px] font-semibold text-tg-blue px-3 pt-2 pb-0">{message.senderId.username}</p>
        )}

        {message.content && (
          <div
            className={clsx(
              'px-3 py-1.5 flex flex-wrap items-end gap-x-2 gap-y-0',
              showSenderName && !isOwn && 'pt-1'
            )}
          >
            <p className="text-[15px] leading-[1.3125] break-words whitespace-pre-wrap flex-[1_1_auto] min-w-[2rem]">
              {message.content}
            </p>
            <span
              className={clsx(
                'inline-flex items-center gap-0.5 shrink-0 text-[11px] leading-none select-none pb-[1px]',
                isOwn ? 'text-tg-outgoing-text/50' : 'text-tg-muted'
              )}
            >
              {formatMessageTime(message.createdAt)}
              {isOwn && <span className="text-tg-blue"><ReadChecks /></span>}
            </span>
          </div>
        )}

        {message.attachments?.length > 0 && (
          <div className="px-2 pb-2 pt-1 space-y-1">
            {message.attachments.map((attachment, index) => (
              <div key={index}>
                {attachment.type === 'image' ? (
                  <img
                    src={attachment.url}
                    alt={attachment.filename}
                    className="max-w-full rounded-xl"
                  />
                ) : (
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-tg-blue text-sm underline px-1"
                  >
                    {attachment.filename}
                  </a>
                )}
              </div>
            ))}
            {!message.content && (
              <div className="flex justify-end px-1 pb-1">
                <span
                  className={clsx(
                    'inline-flex items-center gap-0.5 text-[11px]',
                    isOwn ? 'text-tg-outgoing-text/50' : 'text-tg-muted'
                  )}
                >
                  {formatMessageTime(message.createdAt)}
                  {isOwn && <span className="text-tg-blue"><ReadChecks /></span>}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
