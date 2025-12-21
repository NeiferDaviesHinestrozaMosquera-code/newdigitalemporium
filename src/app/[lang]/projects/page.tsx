
import type { Metadata } from 'next';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { type Locale } from '@/lib/i18n/i18n-config';
import { db } from "@/lib/firebase/config";
import { ref, get } from "firebase/database";
import type { Project } from '@/lib/placeholder-data';
import ProjectCard from '@/components/shared/ProjectCard';
import ScrollReveal from '@/components/shared/ScrollReveal';
import ParallaxSection from '@/components/shared/ParallaxSection';

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  return {
    title: dictionary.projectsPageTitle,
    description: dictionary.projectsPageDescription,
  };
}

async function getProjects(): Promise<Project[]> {
  try {
    const projectsRef = ref(db, 'projects');
    const snapshot = await get(projectsRef);
    if (snapshot.exists()) {
      const projectsObject = snapshot.val();
      const projectsArray = Object.keys(projectsObject).map(key => ({
        id: key,
        ...projectsObject[key]
      }));
      return projectsArray as Project[];
    }
    return [];
  } catch (error) {
    console.error("Error fetching projects from Firebase:", error);
    return [];
  }
}

export default async function ProjectsPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const projects = await getProjects();

  return (
    <ParallaxSection className="container mx-auto px-4 py-12 md:py-16">
      <header className="text-center mb-12 md:mb-16">
        <ScrollReveal direction="up" delay={0.1}>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 tracking-tight">
            {dictionary.projectsPageHeading}
          </h1>
        </ScrollReveal>
        <ScrollReveal direction="up" delay={0.2}>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {dictionary.projectsPageSubheading}
          </p>
        </ScrollReveal>
      </header>

      <main>
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ScrollReveal
                key={project.id}
                direction={index % 2 === 0 ? "left" : "right"}
                delay={0.1 * (index % 3)}
              >
                <ProjectCard project={project} dictionary={dictionary} lang={lang} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold mb-4">No Projects Found</h2>
            <p className="text-muted-foreground">
              There are currently no projects to display. Please check back later.
            </p>
          </div>
        )}
      </main>
    </ParallaxSection>
  );
}
