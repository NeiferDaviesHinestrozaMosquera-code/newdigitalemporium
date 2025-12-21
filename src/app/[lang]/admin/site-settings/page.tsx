// src/app/[lang]/admin/site-settings/page.tsx

import SiteSettingsForm from "@/components/admin/site-settings/SiteSettingsForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSiteContentAction } from "@/components/admin/actions";
import type { Locale } from '@/lib/i18n/i18n-config';

// Definición explícita de la interfaz para evitar conflictos con PageProps
interface SiteSettingsPageProps {
  params: {
    lang: Locale;
  };
}

export default async function SiteSettingsPage({ params }: SiteSettingsPageProps) {
  const siteContent = await getSiteContentAction();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary">Manage Site Content & Settings</h1>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Site Configuration</CardTitle>
          <CardDescription>Update content for About Us, Contact, and Social Media links.</CardDescription>
        </CardHeader>
        <CardContent>
          <SiteSettingsForm initialData={siteContent} />
        </CardContent>
      </Card>
    </div>
  );
}
