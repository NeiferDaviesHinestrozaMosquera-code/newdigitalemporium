
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
import { i18n } from '@/lib/i18n/i18n-config';

interface EditProjectPageProps {
  params?: {
    id?: string;
    lang?: Locale;
  };
}

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

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const projectId = params?.id;
  const lang = params?.lang || i18n.defaultLocale;
  
  if (!projectId) {
    notFound();
  }

  const project = await getProjectFromDB(projectId);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
       <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/${lang}/admin/projects`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Projects</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-primary">Edit Project: {project.title}</h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>Update the information for this project.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectForm initialData={project} formAction="update" />
        </CardContent>
      </Card>
    </div>
  );
}
