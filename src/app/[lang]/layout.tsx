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
import { ReactNode } from 'react';

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

// Tipos correctos para Next.js 15 (params es Promise)
type Props = {
  children: ReactNode;
  params: Promise<{ lang: Locale }>;
};

export const metadata: Metadata = {
  title: 'New Digital Emporium',
  description: 'Tu descripción del sitio',
  // Puedes personalizar más metadata aquí si lo deseas
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default async function LocaleLayout({ children, params }: Props) {
  const { lang } = await params;

  // Cargar el diccionario de traducciones para el locale actual
  const dictionary = await getDictionary(lang);

  return (
    <html lang={lang} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <Providers>
              {/* Pasar el diccionario si algún provider o componente lo necesita */}
              {/* Ejemplo si usas un TranslationProvider personalizado:
              <TranslationProvider dictionary={dictionary}>
              */}
              <CustomCursor />
              <PublicHeader />
              <main className="min-h-screen">
                {children}
              </main>
              <PublicFooter />
              <Toaster />
              {/* </TranslationProvider> */}
            </Providers>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}