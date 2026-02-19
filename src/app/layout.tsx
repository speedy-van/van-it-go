import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import { Providers } from '@/components/Providers';
import '@/styles/globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'VanItGo - Man & Van Removal Service',
  description:
    'Built for people who hate moving stress. Instant quote. Trusted driver. Live map. We handle the hard part.',
  keywords: [
    'man and van',
    'removal service',
    'house moving',
    'furniture delivery',
    'Scotland',
  ],
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: 'VanItGo - Hassle-Free Removal Service',
    description:
      'Instant quote. Trusted driver. Live map. We handle the hard part.',
    siteName: 'VanItGo',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VanItGo - Hassle-Free Removal Service',
    description:
      'Built for people who hate moving stress. Instant quote. Trusted driver. Live map.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${inter.variable}`} suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
