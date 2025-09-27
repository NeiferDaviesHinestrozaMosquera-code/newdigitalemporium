import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { iconMap, type Project } from "@/lib/placeholder-data";
import Image from 'next/image';
import Link from "next/link";
import { PlusCircle, Edit, Trash2, ExternalLink, Github } from "lucide-react";
import { deleteProjectAction } from "@/components/admin/actions";
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

export default async function AdminProjectsPage({ params }: { params?: Promise<{ lang?: Locale }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || i18n.defaultLocale;
  const projects = await getProjectsFromDB();

  // 🔍 CÓDIGO DE DEBUG - AGREGAR AQUÍ
  console.log('=== DEBUG: Projects Data ===');
  console.log('Total projects:', projects.length);
  console.log('Raw projects data:', projects);
  
  projects.forEach((project, index) => {
    console.log(`\n--- Project ${index + 1}: ${project.title} ---`);
    console.log('ID:', project.id);
    console.log('Image URL:', project.image);
    console.log('Image type:', typeof project.image);
    console.log('Technologies:', project.technologies);
    console.log('Technologies type:', typeof project.technologies);
    console.log('Technologies is array:', Array.isArray(project.technologies));
    console.log('Category:', project.category);
    console.log('Client:', project.clientName);
    console.log('Live Link:', project.liveLink);
    console.log('Repo Link:', project.repoLink);
  });
  console.log('=== END DEBUG ===\n');
  // 🔍 FIN DEL CÓDIGO DE DEBUG

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Manage Projects</h1>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href={`/${lang}/admin/projects/new`}>
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Project
          </Link>
        </Button>
      </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const IconComponent = iconMap[project.iconName] || iconMap['Layers'];
            return (
              <Card key={project.id} className="shadow-md flex flex-col">
                <CardHeader>
                  {project.image && (
                    <div className="relative w-full h-48 mb-4 rounded-t-md overflow-hidden">
                      <Image 
                        src={project.image} 
                        alt={project.title} 
                        fill={true} 
                        style={{objectFit: 'cover'}} 
                        data-ai-hint={project.dataAiHint || 'project image'}
                        onError={(e) => {
                          console.error(`❌ Image load error for project "${project.title}":`, project.image);
                          // Opcional: cambiar a imagen de fallback
                          const target = e.target as HTMLImageElement;
                          if (!target.src.includes('placehold.co')) {
                            target.src = 'https://placehold.co/600x400/e2e8f0/64748b?text=Image+Error';
                          }
                        }}
                        onLoad={() => {
                          console.log(`✅ Image loaded successfully for project "${project.title}":`, project.image);
                        }}
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-1">
                    <IconComponent className="w-6 h-6 text-primary" />
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                  </div>
                  <CardDescription className="text-xs text-muted-foreground">{project.category} {project.clientName && `- Client: ${project.clientName}`}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-3">{project.shortDescription}</p>
                  <div>
                    <h4 className="text-xs font-semibold mb-1">Technologies:</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.isArray(project.technologies) && project.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start gap-3 border-t pt-4 mt-auto">
                    <div className="flex gap-2">
                        {project.liveLink && (
                            <Button variant="outline" size="sm" asChild className="text-xs">
                                <Link href={project.liveLink} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Live
                                </Link>
                            </Button>
                        )}
                        {project.repoLink && (
                            <Button variant="outline" size="sm" asChild className="text-xs">
                                <Link href={project.repoLink} target="_blank" rel="noopener noreferrer">
                                <Github className="mr-1.5 h-3.5 w-3.5" /> Repo
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
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the project from Firebase.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <form action={async () => {
                                "use server";
                                if (!project.id) return;
                                await deleteProjectAction(project.id);
                                }}>
                                <AlertDialogAction type="submit">Delete</AlertDialogAction>
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
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No projects found. Add your first project!
          </CardContent>
        </Card>
      )}
    </div>
  );
}
