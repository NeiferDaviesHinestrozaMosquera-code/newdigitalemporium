import type { Project } from '@/lib/placeholder-data';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github, Layers } from 'lucide-react';
import { iconMap } from '@/lib/placeholder-data';
import type { Dictionary } from '@/lib/i18n/get-dictionary';

interface ProjectCardProps {
  project: Project;
  dictionary: Dictionary;
  lang: string;
}

export default function ProjectCard({ project, dictionary, lang }: ProjectCardProps) {
  const IconComponent = iconMap[project.iconName] || Layers;

  // Generate a slug from the project title
  const slug = project.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  
  const imagesArray = project.images && typeof project.images === 'object' 
    ? Object.values(project.images) 
    : project.images;

  return (
    <Card className="group flex flex-col h-full shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden hover:-translate-y-1">
      <CardHeader className="p-0">
        <Link href={`/${lang}/projects/${slug}`} className="block">
          {imagesArray && imagesArray.length > 0 && (
            <div className="relative w-full h-52 rounded-t-lg overflow-hidden">
              <Image 
                src={imagesArray[0]} 
                alt={project.title} 
                fill={true}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{objectFit: 'cover'}}
                className="transition-transform duration-300 ease-in-out group-hover:scale-105"
                data-ai-hint={project.dataAiHint}
              />
            </div>
          )}
        </Link>
         <div className="p-6">
            <Link href={`/${lang}/projects/${slug}`} className="block">
              <div className="flex items-center gap-3 mb-2">
                <IconComponent className="w-7 h-7 text-primary flex-shrink-0" />
                <CardTitle className="text-xl font-semibold text-primary group-hover:text-primary/80 transition-colors">{project.title}</CardTitle>
              </div>
            </Link>
          <CardDescription className="text-sm text-foreground/75 min-h-[3rem] line-clamp-2 mb-2">{project.shortDescription}</CardDescription>
          {project.clientName && <p className="text-xs text-muted-foreground mb-1">{dictionary.projectCardClient as string}: {project.clientName}</p>}
          <p className="text-xs text-muted-foreground">{dictionary.projectCardCategory as string}: {project.category}</p>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-0 flex-grow">
        <div>
            <h4 className="text-xs font-semibold mb-1.5 text-foreground/90">{dictionary.projectCardKeyTechnologies as string}:</h4>
            <div className="flex flex-wrap gap-2">
                {project.technologies && project.technologies.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-xs bg-secondary/70 text-secondary-foreground">
                    {tech}
                </Badge>
                ))}
                 {!project.technologies || project.technologies.length === 0 && (
                  <p className="text-xs text-muted-foreground italic">{dictionary.noTechnologies}</p>
                )}
            </div>
        </div>
      </CardContent>
      <CardFooter className="px-6 pb-6 pt-4 border-t flex flex-wrap justify-start items-center gap-3">
        <Button asChild variant="default" size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href={`/${lang}/projects/${slug}`}>
                 {dictionary.viewProjectDetails || 'View Details'}
            </Link>
        </Button>
        {project.liveLink && (
          <Button asChild variant="outline" size="sm">
            <Link href={project.liveLink} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" /> {dictionary.projectCardLiveDemo as string}
            </Link>
          </Button>
        )}
        {project.repoLink && (
          <Button asChild variant="outline" size="sm">
            <Link href={project.repoLink} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" /> {dictionary.projectCardViewCode as string}
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
