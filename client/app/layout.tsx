import './globals.css';
import { AppProviders } from '@/providers/AppProviders';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0349C5" />
      </head>
      <body className="antialiased bg-gray-100">
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
