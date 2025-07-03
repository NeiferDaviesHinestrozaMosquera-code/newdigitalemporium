
"use client";
import { useParams } from 'next/navigation';
import type { Locale } from '@/lib/i18n/i18n-config';
import type { Dictionary } from '@/lib/i18n/get-dictionary';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { iconMap, type SocialLink } from '@/lib/placeholder-data'; // Import iconMap and SocialLink
import { getSiteContentAction } from '@/components/admin/actions'; // Import action

async function getClientDictionary(lang: Locale) {
  const mod = await import(`@/locales/${lang}.json`);
  return mod.default as Dictionary;
}

export default function PublicFooter({ lang: currentLang }: { lang: Locale }) {
  const params = useParams();
  const currentYear = new Date().getFullYear();
  const [dictionary, setDictionary] = useState<Dictionary | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  
  const lang = (params.lang || currentLang || 'en') as Locale;
  // Determine current pathname using window.location on client-side
  const [pathname, setPathname] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setPathname(window.location.pathname);
    }
  }, []);


  useEffect(() => {
    getClientDictionary(lang).then(setDictionary);
    async function fetchSiteContent() {
      try {
        const content = await getSiteContentAction();
        setSocialLinks(content.socialLinks || []);
      } catch (error) {
        console.error("Failed to fetch site content for footer:", error);
      }
    }
    fetchSiteContent();
  }, [lang]);

  // Do not render footer on admin or login pages for the current locale
  if (pathname === `/${lang}/admin` || pathname.startsWith(`/${lang}/admin/`) || pathname === `/${lang}/login`) {
    return null;
  }

  if (!dictionary) {
    return (
      <footer className="border-t border-border/40 bg-background/95">
        <div className="container py-8 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} Digital Emporium. All rights reserved.</p>
        </div>
      </footer>
    );
  }

  const footerText = (dictionary.footerText as string || "").replace("{currentYear}", currentYear.toString());

  return (
    <footer className="border-t border-border/40 bg-background/95 text-muted-foreground">
      <div className="container py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-sm">{footerText}</p>
            <p className="mt-1 text-xs">
              {dictionary.footerTagline as string}
            </p>
          </div>
          {socialLinks.length > 0 && (
            <div className="flex flex-col items-center md:items-end gap-3">
              <p className="text-sm font-medium">{dictionary.followUs as string}</p>
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const IconComponent = iconMap[social.iconName] || iconMap['HelpCircle'];
                  return (
                    <Link
                      key={social.id || social.name} // Use id if available, fallback to name
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label={social.name}
                    >
                      <IconComponent className="h-5 w-5" />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}

    