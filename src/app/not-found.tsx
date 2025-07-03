// This global not-found.tsx is a fallback.
// Our middleware should redirect to a localized path,
// which would then use the /app/[lang]/not-found.tsx for a localized 404 message.
// However, Next.js requires a root not-found.js file.
// We can make this a simple, non-localized version.

import Link from 'next/link';
import { i18n } from '@/lib/i18n/i18n-config';

export default function NotFound() {
  // A safe fallback for a global 404 is to link to the default locale's home page.
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
      <p className="mb-8">The page you are looking for does not exist.</p>
      <Link href={`/${i18n.defaultLocale}`} className="text-primary hover:underline">
        Go to Homepage
      </Link>
    </div>
  );
}
