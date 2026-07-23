import type { Metadata } from 'next';
import './[locale]/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.reachprojector.com'),
  title: 'REACH Projector',
  description: 'Professional projector and electronics supplier',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
