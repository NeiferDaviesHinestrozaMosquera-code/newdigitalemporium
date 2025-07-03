
// This file is intentionally left almost empty.
// The main RootLayout is now in src/app/[lang]/layout.tsx
// Next.js requires a root layout at src/app/layout.tsx for the App Router,
// even if it just passes children through.
// Our middleware will handle redirecting to a localized path.

import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
