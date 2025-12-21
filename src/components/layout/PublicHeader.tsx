"use client";

import Link from 'next/link';
import { usePathname, useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, CodeXml, LogIn, LogOut, UserCog, Info, Mail } from 'lucide-react'; // Added Info and Mail icons
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { auth } from '@/lib/firebase/config';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from './ThemeToggle';
import LocaleSwitcher from './LocaleSwitcher';
import type { Locale } from '@/lib/i18n/i18n-config';
import type { Dictionary } from '@/lib/i18n/get-dictionary';
import { useEffect, useState } from 'react';

async function getClientDictionary(lang: Locale) {
  const mod = await import(`@/locales/${lang}.json`);
  return mod.default as Dictionary;
}


export default function PublicHeader({ lang: currentLang }: { lang: Locale }) {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [dictionary, setDictionary] = useState<Dictionary | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const lang = (params.lang || currentLang || 'en') as Locale;

  useEffect(() => {
    getClientDictionary(lang).then(setDictionary);
  }, [lang]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: dictionary?.logout || 'Logged Out', description: 'You have been successfully logged out.' });
      setIsSheetOpen(false);
      router.push(`/${lang}/`); 
    } catch (error) {
      console.error("Logout error:", error);
      toast({ title: 'Logout Failed', description: 'Could not log you out. Please try again.', variant: 'destructive' });
    }
  };
  
  const navLinksBase = [
    { href: '/', labelKey: 'home' },
    { href: '/services', labelKey: 'services' },
    { href: '/projects', labelKey: 'projects' },
    { href: '/about', labelKey: 'aboutUs', icon: Info },
    { href: '/contact', labelKey: 'contact', icon: Mail },
    { href: '/quote-request', labelKey: 'requestAQuote' },
  ];
  
  const adminLink = { href: '/admin', labelKey: 'adminPanel', icon: UserCog };

  const getNavLinks = () => {
    const links = navLinksBase.map(link => ({
      ...link,
      label: dictionary?.[link.labelKey] as string || link.labelKey,
      href: `/${lang}${link.href === '/' ? '' : link.href}`
    }));
    if (user) {
      links.push({ 
        ...adminLink, 
        label: dictionary?.[adminLink.labelKey] as string || adminLink.labelKey,
        href: `/${lang}${adminLink.href}`
      });
    }
    return links;
  };
  
  const currentNavLinks = getNavLinks();

  // Do not render header on admin or login pages for the current locale
  if (pathname === `/${lang}/admin` || pathname.startsWith(`/${lang}/admin/`) || pathname === `/${lang}/login`) {
    return null;
  }
  
  if (!dictionary) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-md">
        <div className="container flex h-20 max-w-screen-2xl items-center justify-between">
          <Link href={`/${lang}/`} className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
            <CodeXml className="h-8 w-8" />
            <span className="font-bold text-2xl">Digital Emporium</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LocaleSwitcher currentLocale={lang} />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-md">
      <div className="container flex h-20 max-w-screen-2xl items-center justify-between">
        <Link href={`/${lang}/`} className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
          <CodeXml className="h-8 w-8" />
          <span className="font-bold text-xl md:text-2xl">{dictionary.siteTitle as string}</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {currentNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors duration-200 hover:text-primary px-2.5 py-1.5 rounded-md",
                pathname === link.href 
                  ? "text-primary font-semibold bg-primary/10" 
                  : "text-foreground/70"
              )}
            >
              {link.label}
            </Link>
          ))}
          {!loading && (
            user ? (
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> {dictionary.logout as string}
              </Button>
            ) : (
              // ELIMINADO: Botón de Admin Login
              null
            )
          )}
          <ThemeToggle />
          <LocaleSwitcher currentLocale={lang} />
        </nav>

        <div className="md:hidden flex items-center gap-2">
           <ThemeToggle />
           <LocaleSwitcher currentLocale={lang} />
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px]">
              <nav className="flex flex-col space-y-2 mt-6">
                {currentNavLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsSheetOpen(false)}
                    className={cn(
                      "text-base font-medium transition-colors duration-200 py-2.5 px-3 rounded-md flex items-center gap-3",
                       pathname === link.href 
                        ? "text-primary font-semibold bg-primary/10" 
                        : "text-foreground/80 hover:text-primary hover:bg-muted"
                    )}
                  >
                     {link.icon && <link.icon className="h-5 w-5" />}
                    {link.label}
                  </Link>
                ))}
                 <div className="pt-4 mt-4 border-t">
                 {!loading && (
                    user ? (
                    <Button variant="outline" className="w-full justify-start text-base py-2.5 px-3" onClick={handleLogout}>
                        <LogOut className="mr-3 h-5 w-5" /> {dictionary.logout as string}
                    </Button>
                    ) : (
                    // ELIMINADO: Botón de Admin Login en el menú móvil
                    null
                    )
                )}
                 </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}