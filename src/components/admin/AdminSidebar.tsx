
"use client";

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, ShoppingBag, MessageSquare, Users, CodeXml, LogOut, Briefcase, Settings, Loader2 } from 'lucide-react';
import type { Locale } from '@/lib/i18n/i18n-config';
import type { Dictionary } from '@/lib/i18n/get-dictionary';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

async function getClientDictionary(lang: Locale): Promise<Dictionary> {
  const mod = await import(`@/locales/${lang}.json`);
  return mod.default as Dictionary;
}


export default function AdminSidebar() {
  const pathname = usePathname();
  const params = useParams();
  const lang = params.lang as Locale || 'en';
  const [dictionary, setDictionary] = useState<Dictionary | null>(null);

  useEffect(() => {
    getClientDictionary(lang).then(setDictionary);
  }, [lang]);
  
  const adminNavLinks = dictionary ? [
    { href: `/${lang}/admin`, label: dictionary.dashboard as string, icon: LayoutDashboard },
    { href: `/${lang}/admin/services`, label: dictionary.manageServices as string, icon: ShoppingBag },
    { href: `/${lang}/admin/testimonials`, label: dictionary.manageTestimonials as string, icon: Users },
    { href: `/${lang}/admin/projects`, label: dictionary.manageProjects as string, icon: Briefcase },
    { href: `/${lang}/admin/inquiries`, label: dictionary.manageInquiries as string, icon: MessageSquare },
    { href: `/${lang}/admin/site-settings`, label: dictionary.manageSiteSettings as string, icon: Settings },
  ] : [];

  if (!dictionary) {
    return (
       <aside className="w-64 bg-card text-card-foreground border-r border-border flex flex-col fixed top-0 left-0 h-full pt-4">
         <div className="px-6 mb-8">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-6 w-32" />
            </div>
         </div>
         <nav className="flex-grow px-4 space-y-2">
            {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex items-center px-3 py-2.5">
                    <Skeleton className="h-5 w-5 mr-3" />
                    <Skeleton className="h-5 w-full" />
                </div>
            ))}
         </nav>
          <div className="p-4 border-t border-border mt-auto">
             <Skeleton className="h-8 w-full" />
          </div>
       </aside>
    );
  }

  return (
    <aside className="w-64 bg-card text-card-foreground border-r border-border flex flex-col fixed top-0 left-0 h-full pt-4">
      <div className="px-6 mb-8">
        <Link href={`/${lang}/admin`} className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
          <CodeXml className="h-7 w-7" />
          <span className="font-bold text-xl">{dictionary.adminPanelTitle as string}</span>
        </Link>
      </div>
      <nav className="flex-grow px-4 space-y-2">
        {adminNavLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
              pathname === link.href || (link.href !== `/${lang}/admin` && pathname.startsWith(link.href))
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "text-foreground/70 hover:bg-muted hover:text-foreground"
            )}
          >
            <link.icon className="mr-3 h-5 w-5" />
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-border mt-auto">
         <Link
            href={`/${lang}/`}
            className={cn(
              "flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors text-foreground/70 hover:bg-muted hover:text-foreground"
            )}
          >
            <LogOut className="mr-3 h-5 w-5" />
            {dictionary.backToSite as string}
          </Link>
      </div>
    </aside>
  );
}
