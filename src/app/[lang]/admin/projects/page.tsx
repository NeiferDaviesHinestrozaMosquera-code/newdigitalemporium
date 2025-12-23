import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { iconMap, type Project } from "@/lib/placeholder-data";
import ProjectImage from "@/components/admin/projects/ProjectImage";
import Link from "next/link";
import { PlusCircle, Edit, Trash2, ExternalLink, Github } from "lucide-react";
import { deleteProjectAction } from "@/components/admin/project-action";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/firebase/config";
import { ref, get, child } from "firebase/database";
import type { Locale } from '@/lib/i18n/i18n-config';
import { i18n } from '@/lib/i18n/i18n-config';
import { getDictionary } from '@/lib/i18n/get-dictionary';

async function getProjectsFromDB(): Promise<Project[]> {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `projects`));
    if (snapshot.exists()) {
      const projectsObject = snapshot.val();
      const projectsArray = Object.keys(projectsObject)
        .map(key => ({ id: key, ...projectsObject[key] }))
        .sort((a, b) => a.title.localeCompare(b.title)); 
      return projectsArray as Project[];
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching projects from Firebase DB:", error);
    return [];
  }
}

// ✅ CORRECCIÓN: params ahora es Promise
export default async function AdminProjectsPage({ 
  params 
}: { 
  params: Promise<{ lang: Locale }> 
}) {
  // ✅ Await params antes de desestructurar
  const { lang } = await params;
  const projects = await getProjectsFromDB();
  const dictionary = await getDictionary(lang || i18n.defaultLocale);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">{dictionary.manageProjects}</h1>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href={`/${lang}/admin/projects/new`}>
            <PlusCircle className="mr-2 h-5 w-5" /> {dictionary.addNewProject}
          </Link>
        </Button>
      </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const IconComponent = iconMap[project.iconName] || iconMap['Layers'];
            return (
              <Card key={project.id} className="shadow-md flex flex-col bg-card">
                <CardHeader className="p-0">
                  {project.image && (
                    <ProjectImage 
                      src={project.image}
                      alt={project.title}
                      title={project.title}
                      dataAiHint={project.dataAiHint}
                    />
                  )}
                  <div className="p-4 pb-2">
                    <div className="flex items-center gap-3 mb-2">
                      <IconComponent className="w-6 h-6 text-primary" />
                      <CardTitle className="text-lg font-semibold">{project.title}</CardTitle>
                    </div>
                    <CardDescription className="text-sm text-muted-foreground">
                      {project.category} {project.clientName && `- ${dictionary.projectCardClient}: ${project.clientName}`}
                    </CardDescription>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-grow space-y-3 px-4">
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {project.shortDescription}
                  </p>
                  
                  <div>
                    <h4 className="text-xs font-semibold mb-2 text-primary">{dictionary.projectCardKeyTechnologies}:</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.isArray(project.technologies) ? (
                        project.technologies.slice(0, 5).map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs px-2 py-0.5">
                            {tech}
                          </Badge>
                        ))
                      ) : typeof project.technologies === 'string' ? (
                        project.technologies.split(',').slice(0, 5).map((tech) => (
                          <Badge key={tech.trim()} variant="secondary" className="text-xs px-2 py-0.5">
                            {tech.trim()}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="outline" className="text-xs">{dictionary.noTechnologies}</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex flex-col items-start gap-3 border-t pt-4 mt-auto px-4 pb-4">
                  <div className="flex gap-2 w-full">
                    {project.liveLink && (
                      <Button variant="outline" size="sm" asChild className="text-xs flex-1">
                        <Link href={project.liveLink} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> {dictionary.projectCardLiveDemo}
                        </Link>
                      </Button>
                    )}
                    {project.repoLink && (
                      <Button variant="outline" size="sm" asChild className="text-xs flex-1">
                        <Link href={project.repoLink} target="_blank" rel="noopener noreferrer">
                          <Github className="mr-1.5 h-3.5 w-3.5" /> {dictionary.projectCardViewCode}
                        </Link>
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex justify-end gap-2 w-full">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/${lang}/admin/projects/edit/${project.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{dictionary.areYouSure}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {dictionary.deleteProjectWarning} "{project.title}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{dictionary.cancel}</AlertDialogCancel>
                          <form action={async () => {
                            "use server";
                            if (!project.id) return;
                            await deleteProjectAction(project.id);
                          }}>
                            <AlertDialogAction type="submit">{dictionary.delete}</AlertDialogAction>
                          </form>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="w-full bg-card shadow-lg border-2 border-dashed border-muted-foreground/30 hover:border-primary/60 transition-all duration-300 ease-in-out">
          <CardContent 
            className="p-10 text-center text-muted-foreground flex flex-col items-center justify-center h-full"
          >
            <div className="flex flex-col items-center gap-6 p-8 rounded-lg bg-background/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-primary/50">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
                <path d="M14.5 3.5v-2a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v2"/>
                <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0"/>
                <path d="m14.2 14.2.8.8"/>
                <path d="m16.5 10-.8.8"/>
              </svg>
              <div>
                <h3 className="text-xl font-bold mb-2 text-card-foreground">{dictionary.noProjectsFoundTitle}</h3>
                <p className="text-sm max-w-xs mx-auto">{dictionary.noProjectsFoundDescription}</p>
              </div>
              <Button asChild className="mt-4 text-sm font-semibold">
                <Link href={`/${lang}/admin/projects/new`}>
                  <PlusCircle className="mr-2 h-5 w-5" />
                  {dictionary.addNewProjectCTA}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}