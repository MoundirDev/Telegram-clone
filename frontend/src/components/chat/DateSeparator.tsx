'use client';

interface DateSeparatorProps {
  label: string;
}

export default function DateSeparator({ label }: DateSeparatorProps) {
  return (
    <div className="flex justify-center my-3">
      <span className="tg-pill-surface text-[13px] font-medium px-3 py-1 rounded-full shadow-bubble">
        {label}
      </span>
    </div>
  );
}
