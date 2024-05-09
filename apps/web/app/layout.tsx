import './global.css';
import StyledComponentsRegistry from '@/libs/AntdRegistry';
import type { ReactNode } from 'react';

export interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='zh-CN'>
    <body className={'antialiased'}>
    <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
    </body>
    </html>
  );
}
