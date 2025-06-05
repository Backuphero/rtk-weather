import React from 'react';
import './globals.css';
import ReduxProvider from './components/ReduxProvider';

export const metadata = {
  title: 'Weather Forecast App',
  description: 'A weather forecast application with charts and maps',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
