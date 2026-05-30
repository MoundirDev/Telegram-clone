'use client';

interface LoadingSkeletonProps {
  count?: number;
  variant?: 'chat' | 'message';
}

export default function LoadingSkeleton({
  count = 3,
  variant = 'chat',
}: LoadingSkeletonProps) {
  if (variant === 'message') {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className="h-11 rounded-2xl animate-pulse"
              style={{
                width: i % 2 === 0 ? '45%' : '55%',
                background: 'var(--tg-skeleton)',
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-2.5 animate-pulse">
          <div
            className="w-[54px] h-[54px] rounded-full flex-shrink-0"
            style={{ background: 'var(--tg-skeleton)' }}
          />
          <div className="flex-1">
            <div
              className="h-4 rounded mb-2 w-1/3"
              style={{ background: 'var(--tg-skeleton)' }}
            />
            <div className="h-3 rounded w-2/3" style={{ background: 'var(--tg-hover)' }} />
          </div>
        </div>
      ))}
    </div>
  );
}
