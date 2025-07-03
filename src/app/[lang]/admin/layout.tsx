
"use client"; 

import AdminSidebar from '@/components/admin/AdminSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } // Added useParams
from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import type { Locale } from '@/lib/i18n/i18n-config';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams(); // Get params
  const lang = params.lang as Locale || 'en'; // Get lang from params

  useEffect(() => {
    if (typeof document !== 'undefined') { 
        document.title = 'Admin Dashboard - Digital Emporium';
    }
    if (!loading && !user) {
      // Ensure redirect URL is properly constructed with locale
      const currentPath = window.location.pathname + window.location.search;
      const loginPath = `/${lang}/login?redirect=${encodeURIComponent(currentPath)}`;
      router.push(loginPath);
    }
  }, [user, loading, router, lang]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
       <div className="flex h-screen items-center justify-center bg-background">
         <p>Redirecting to login...</p>
         <Loader2 className="ml-2 h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto ml-64">
        {children}
      </main>
    </div>
  );
}
