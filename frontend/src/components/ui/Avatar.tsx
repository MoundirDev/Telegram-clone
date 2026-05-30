'use client';

import { getAvatarGradient, getInitials } from '@/lib/chatUtils';
import clsx from 'clsx';

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-[54px] h-[54px] text-lg',
  lg: 'w-14 h-14 text-xl',
  header: 'w-10 h-10 text-sm',
};

interface AvatarProps {
  name: string;
  src?: string;
  size?: keyof typeof sizes;
  isGroup?: boolean;
  className?: string;
  online?: boolean;
}

export default function Avatar({
  name,
  src,
  size = 'md',
  isGroup,
  className,
  online,
}: AvatarProps) {
  const gradient = getAvatarGradient(name);

  return (
    <div className={clsx('relative flex-shrink-0', className)}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={clsx('rounded-full object-cover', sizes[size])}
        />
      ) : (
        <div
          className={clsx(
            'rounded-full flex items-center justify-center font-semibold text-white bg-gradient-to-br',
            gradient,
            sizes[size],
            isGroup && 'text-base'
          )}
        >
          {isGroup ? (
            <svg className="w-1/2 h-1/2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
          ) : (
            getInitials(name)
          )}
        </div>
      )}
      {online && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-tg-online border-2 border-tg-sidebar rounded-full" />
      )}
    </div>
  );
}
