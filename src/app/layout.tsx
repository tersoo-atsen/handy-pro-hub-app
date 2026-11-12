import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import { SupabaseProvider } from '@/providers/supabase-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Handy Pro — Find Skilled Artisans Near You',
    template: '%s | Handy Pro',
  },
  description:
    'Connect with verified plumbers, electricians, carpenters, and more. Get instant bids, real-time tracking, and secure payments.',
  keywords: [
    'artisan',
    'handyman',
    'plumber',
    'electrician',
    'home services',
    'Nigeria',
  ],
  openGraph: {
    title: 'Handy Pro — Find Skilled Artisans Near You',
    description:
      'On-demand marketplace connecting customers with skilled artisans via real-time bidding and geolocation matching.',
    type: 'website',
    locale: 'en_NG',
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
        <SupabaseProvider>
          <AuthProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </AuthProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
