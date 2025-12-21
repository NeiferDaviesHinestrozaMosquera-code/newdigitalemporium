
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { type Locale } from '@/lib/i18n/i18n-config';
import { db } from "@/lib/firebase/config";
import { ref, query, orderByChild, equalTo, get } from "firebase/database";
import type { Project } from '@/lib/placeholder-data';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ProjectImageCarousel from '@/components/projects/ProjectImageCarousel';
import GoBackButton from '@/components/shared/GoBackButton';
import ScrollReveal from '@/components/shared/ScrollReveal';
import ParallaxSection from '@/components/shared/ParallaxSection';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github, Calendar, User, Layers, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Helper to get project by slug
async function getProjectBySlug(slug: string): Promise<Project | null> {
  const projectsRef = ref(db, 'projects');
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); // Basic slug-to-title

  // This is not super efficient as it requires client-side filtering.
  // A better solution would be to store a slug field in the database.
  try {
    const snapshot = await get(projectsRef);
    if (snapshot.exists()) {
      const projectsObject = snapshot.val();
      const projectsArray = Object.keys(projectsObject).map(key => ({
        id: key,
        ...projectsObject[key]
      }));
      
      const project = projectsArray.find(p => p.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') === slug);
      return project || null;
    }
    return null;
  } catch (error) {
    console.error("Error fetching project by slug:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; lang: Locale }> }): Promise<Metadata> {
  const { slug, lang } = await params;
  const project = await getProjectBySlug(slug);
  const dictionary = await getDictionary(lang);
  
  if (!project) {
    return {
      title: 'Project Not Found',
      description: 'The requested project could not be found.'
    }
  }

  return {
    title: `${project.title} - ${dictionary.projectsPageTitle}`,
    description: project.shortDescription,
  };
}


export default async function ProjectDetailsPage({ params }: { params: Promise<{ slug: string; lang: Locale }> }) {
  const { slug, lang } = await params;
  const project = await getProjectBySlug(slug);
  const dictionary = await getDictionary(lang);

  if (!project) {
    notFound();
  }

  const imagesArray = project.images && typeof project.images === 'object'
    ? Object.values(project.images)
    : [];

  return (
    <ParallaxSection className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
            <ScrollReveal direction="left" delay={0.1}>
              <div className="mb-8">
                  <GoBackButton dictionary={dictionary} />
              </div>
            </ScrollReveal>

            <main>
                 {/* Carousel */}
                <ScrollReveal direction="up" delay={0.2}>
                  <ProjectImageCarousel images={imagesArray} altText={project.title} />
                </ScrollReveal>

                {/* Header */}
                <ScrollReveal direction="up" delay={0.3}>
                  <header className="my-8">
                      <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight mb-4">{project.title}</h1>
                      <p className="text-lg text-muted-foreground">{project.shortDescription}</p>
                  </header>
                </ScrollReveal>

                {/* Project Info Badges */}
                <ScrollReveal direction="up" delay={0.4}>
                  <div className="flex flex-wrap gap-4 mb-8 text-sm text-muted-foreground">
                      {project.clientName && (
                          <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-accent" />
                              <span>{project.clientName}</span>
                          </div>
                      )}
                      {project.category && (
                          <div className="flex items-center gap-2">
                              <Layers className="h-4 w-4 text-accent" />
                              <span>{project.category}</span>
                          </div>
                      )}
                       {/* Date - Assuming you add this field later */}
                      <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-accent" />
                          <span>Date placeholder (e.g., Q2 2023)</span>
                      </div>
                  </div>
                </ScrollReveal>

                {/* Full Description */}
                <ScrollReveal direction="up" delay={0.5}>
                  <article className="prose prose-lg dark:prose-invert max-w-none mb-12">
                     <p>{project.description}</p>
                  </article>
                </ScrollReveal>

                {/* Technologies */}
                <ScrollReveal direction="up" delay={0.6}>
                  <section className="mb-12">
                      <h2 className="text-2xl font-semibold text-primary mb-4">{dictionary.projectCardKeyTechnologies as string}</h2>
                      <div className="flex flex-wrap gap-3">
                          {project.technologies?.map(tech => (
                              <Badge key={tech} variant="secondary" className="text-md px-3 py-1">{tech}</Badge>
                          ))}
                          {!project.technologies || project.technologies.length === 0 && (
                              <p className="text-sm text-muted-foreground italic">{dictionary.noTechnologies}</p>
                          )}
                      </div>
                  </section>
                </ScrollReveal>

                {/* Links */}
                <ScrollReveal direction="up" delay={0.7}>
                  <section>
                      <h2 className="text-2xl font-semibold text-primary mb-4">Project Links</h2>
                       <div className="flex flex-wrap items-center gap-4">
                          {project.liveLink && (
                              <Button asChild >
                                  <Link href={project.liveLink} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="mr-2 h-4 w-4" /> {dictionary.projectCardLiveDemo as string}
                                  </Link>
                              </Button>
                          )}
                          {project.repoLink && (
                              <Button asChild variant="outline">
                                  <Link href={project.repoLink} target="_blank" rel="noopener noreferrer">
                                  <Github className="mr-2 h-4 w-4" /> {dictionary.projectCardViewCode as string}
                                  </Link>
                              </Button>
                          )}
                           {!project.liveLink && !project.repoLink && (
                              <p className="text-sm text-muted-foreground italic">{dictionary.projectCardNoPublicLinks as string}</p>
                          )}
                      </div>
                  </section>
                </ScrollReveal>
            </main>
        </div>
    </ParallaxSection>
  );
}
