import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import { Toaster } from '@/components/ui/toaster';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { Providers } from '../providers';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from 'next-themes';
import type { Locale } from '@/lib/i18n/i18n-config';
import { i18n } from '@/lib/i18n/i18n-config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import CustomCursor from '@/components/shared/CustomCursor';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

// ✅ SOLUCIÓN: Usar el tipo genérico correcto de Next.js
type PageProps = {
  params: Promise<{ lang: Locale }>;
};

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return {
    title: dictionary.siteTitle as string || 'Digital Emporium',
    description: dictionary.siteDescription as string || 'Your one-stop solution for cutting-edge digital services.',
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

// ✅ SOLUCIÓN: Agregar children al tipo PageProps
type LayoutProps = PageProps & {
  children: React.ReactNode;
};

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps) {
  const { lang } = await params;

  return (
    <div
      lang={lang}
      className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>
          <Providers>
            <PublicHeader lang={lang} />
            <main className="flex-grow">{children}</main>
            <PublicFooter lang={lang} />
            <Toaster />
            <CustomCursor />
          </Providers>
        </AuthProvider>
      </ThemeProvider>
    </div>
  );
}