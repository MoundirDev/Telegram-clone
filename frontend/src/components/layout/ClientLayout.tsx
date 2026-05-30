'use client';

import { useEffect, useState } from 'react';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null;
  }

  return <div className="h-dvh w-full max-w-[100vw] overflow-hidden">{children}</div>;
}
