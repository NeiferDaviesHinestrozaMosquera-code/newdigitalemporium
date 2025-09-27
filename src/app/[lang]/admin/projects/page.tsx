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
                <CardHeader className="p-0">
                  {/* Imagen mejorada con manejo de errores */}
                  {project.image && (
                    <div className="relative w-full h-48 rounded-t-lg overflow-hidden bg-gray-100">
                      <Image 
                        src={project.image} 
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-opacity duration-300"
                        data-ai-hint={project.dataAiHint || 'project image'}
                        onError={(e) => {
                          console.error('Image failed to load:', project.image);
                          // No cambiamos la src aquí para evitar loops infinitos
                        }}
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R7+XvLvK5U2DEIbdyZmjQE4x03rJy8cevgDITSa+hV4ePPBXGK+aMqI4FfWjfOT+zWdFEsNalZFTOtJ0RiOSuRj18HZZ3cMrVCkrZFIFHT7qLr5j7w72xzGVi+2xFP2cYTlpNFv5TXhOe76vwA8bKrXIufrYovWRLbpC1BEMhZSu4T1LJFh3nzAD5cYdlKGxmfA=="
                        priority={false}
                      />
                      {/* Overlay para mostrar información adicional */}
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300 flex items-end">
                        <div className="p-3 text-white opacity-0 hover:opacity-100 transition-opacity duration-300">
                          <span className="text-xs font-medium">Click to edit</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="p-4 pb-2">
                    <div className="flex items-center gap-3 mb-2">
                      <IconComponent className="w-6 h-6 text-primary" />
                      <CardTitle className="text-lg font-semibold">{project.title}</CardTitle>
                    </div>
                    <CardDescription className="text-sm text-muted-foreground">
                      {project.category} {project.clientName && `- Client: ${project.clientName}`}
                    </CardDescription>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-grow space-y-3 px-4">
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {project.shortDescription}
                  </p>
                  
                  {/* Tecnologías */}
                  <div>
                    <h4 className="text-xs font-semibold mb-2 text-primary">Technologies:</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.isArray(project.technologies) ? (
                        project.technologies.slice(0, 5).map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs px-2 py-0.5">
                            {tech}
                          </Badge>
                        ))
                      ) : (
                        // Fallback si technologies no es un array
                        project.technologies?.split(',').slice(0, 5).map((tech) => (
                          <Badge key={tech.trim()} variant="secondary" className="text-xs px-2 py-0.5">
                            {tech.trim()}
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex flex-col items-start gap-3 border-t pt-4 mt-auto px-4 pb-4">
                  <div className="flex gap-2 w-full">
                    {project.liveLink && (
                      <Button variant="outline" size="sm" asChild className="text-xs flex-1">
                        <Link href={project.liveLink} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Live
                        </Link>
                      </Button>
                    )}
                    {project.repoLink && (
                      <Button variant="outline" size="sm" asChild className="text-xs flex-1">
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
                            This action cannot be undone. This will permanently delete the project "{project.title}" from Firebase.
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
          <CardContent className="p-8 text-center text-muted-foreground">
            <div className="flex flex-col items-center gap-4">
              <PlusCircle className="h-16 w-16 text-muted-foreground/50" />
              <div>
                <h3 className="text-lg font-semibold mb-2">No projects found</h3>
                <p className="text-sm">Add your first project to get started!</p>
              </div>
              <Button asChild className="mt-2">
                <Link href={`/${lang}/admin/projects/new`}>
                  Add New Project
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
