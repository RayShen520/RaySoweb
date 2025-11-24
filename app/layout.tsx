import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RaySo AI - 智能科技引领未来',
  description: 'RaySo AI 专注人工智能解决方案，提供 AI+AR 智能眼镜、智能办公助手与语言学习产品。'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

