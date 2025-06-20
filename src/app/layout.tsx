import { ReactNode } from 'react';
import './globals.css';
import SessionWrapper from './SessionWrapper';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}