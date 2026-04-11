import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Quico',
  description: 'Summarize, explain code, write emails, generate ideas.',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-[#0e0e0c] text-white antialiased`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1a1a18',
              color: '#e0e0dc',
              border: '1px solid #2e2e2c',
              borderRadius: '8px',
              fontSize: '13.5px',
              fontWeight: '450',
            },
            success: { iconTheme: { primary: '#7fba7a', secondary: '#1a1a18' } },
            error: { iconTheme: { primary: '#e06c6c', secondary: '#1a1a18' } },
          }}
        />
      </body>
    </html>
  );
}
