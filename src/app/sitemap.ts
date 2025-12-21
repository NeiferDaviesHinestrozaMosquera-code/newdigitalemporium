
import { MetadataRoute } from 'next'
import { i18n } from '@/lib/i18n/i18n-config'
import { db } from '@/lib/firebase/config'
import { ref, get, child } from 'firebase/database'
import type { Service, Project } from '@/lib/placeholder-data'

//const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.com';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://newdigitalemporium.vercel.app/';


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages = [
    '',
    '/about',
    '/contact',
    '/projects',
    '/quote-request',
    '/services'
  ];

  const staticRoutes = staticPages.flatMap(page => 
    i18n.locales.map(locale => ({
      url: `${BASE_URL}/${locale}${page}`,
      lastModified: new Date(),
    }))
  );

  // Dynamic service pages
  let serviceRoutes: MetadataRoute.Sitemap = [];
  try {
    const servicesSnapshot = await get(child(ref(db), 'services'));
    if (servicesSnapshot.exists()) {
      const services = servicesSnapshot.val() as Record<string, Service>;
      serviceRoutes = Object.values(services).flatMap(service =>
        i18n.locales.map(locale => ({
          url: `${BASE_URL}/${locale}/services#${service.slug}`,
          lastModified: new Date(),
        }))
      );
    }
  } catch (error) {
      console.error("Error fetching services for sitemap:", error);
  }

  // Dynamic project pages (if they had individual pages, but they don't, so we'll skip)
  // If you add individual project pages later, you would fetch and map them here.

  return [...staticRoutes, ...serviceRoutes];
}
