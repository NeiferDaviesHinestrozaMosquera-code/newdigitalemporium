
import ProjectForm from "@/components/admin/projects/ProjectForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Locale } from '@/lib/i18n/i18n-config';
import { i18n } from '@/lib/i18n/i18n-config';
import { getDictionary } from '@/lib/i18n/get-dictionary';

export default async function NewProjectPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang || i18n.defaultLocale);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/${lang}/admin/projects`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">{dictionary.backToProjects}</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-primary">{dictionary.addNewProject}</h1>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>{dictionary.projectFormCardTitle}</CardTitle>
          <CardDescription>{dictionary.projectFormCardDescriptionNew}</CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectForm formAction="create" dictionary={dictionary} />
        </CardContent>
      </Card>
    </div>
  );
}
