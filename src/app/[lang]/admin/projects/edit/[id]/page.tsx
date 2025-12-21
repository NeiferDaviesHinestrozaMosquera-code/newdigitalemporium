
import ProjectForm from "@/components/admin/projects/ProjectForm";
import type { Project } from "@/lib/placeholder-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { db } from "@/lib/firebase/config";
import { ref, get, child } from "firebase/database";
import type { Locale } from '@/lib/i18n/i18n-config';
import { getDictionary } from '@/lib/i18n/get-dictionary';

async function getProjectFromDB(id: string): Promise<Project | null> {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `projects/${id}`));
    if (snapshot.exists()) {
      return { id: snapshot.key, ...snapshot.val() } as Project;
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error fetching project ${id} from Firebase DB:`, error);
    return null;
  }
}

export default async function EditProjectPage({ params }: { params: { id: string; lang: Locale } }) {
  const { id, lang } =  params;
  const dictionary = await getDictionary(lang);
  
  if (!id) {
    notFound();
  }

  const project = await getProjectFromDB(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
       <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/${lang}/admin/projects`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">{dictionary.backToProjects}</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-primary">{`${dictionary.editProjectTitle}: ${project.title}`}</h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>{dictionary.projectFormCardTitle}</CardTitle>
          <CardDescription>{dictionary.projectFormCardDescriptionUpdate}</CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectForm initialData={project} formAction="update" dictionary={dictionary} />
        </CardContent>
      </Card>
    </div>
  );
}
