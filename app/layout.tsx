import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Quico — Quick AI Tools',
  description: 'Summarize, explain code, write emails, generate ideas — all in one command.',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-[#080810] text-white antialiased`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#12121e',
              color: '#e2e2f0',
              border: '1px solid #252538',
              borderRadius: '10px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#8b5cf6', secondary: '#12121e' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#12121e' } },
          }}
        />
      </body>
    </html>
  );
}
