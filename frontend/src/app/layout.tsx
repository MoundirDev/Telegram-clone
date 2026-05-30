import type { Metadata } from 'next';
import '@/styles/globals.css';
import ClientLayout from '@/components/layout/ClientLayout';
import Providers from '@/components/providers/Providers';

export const metadata: Metadata = {
  title: 'Telegram',
  description: 'Telegram-inspired messaging UI',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="h-dvh overflow-hidden">
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
