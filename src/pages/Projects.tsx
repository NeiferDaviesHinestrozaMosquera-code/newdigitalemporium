import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExternalLink, ChevronLeft, ChevronRight,
  Calendar, User, Folder, Code2
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';

const technologies = {
  react: { name: 'React', icon: '⚛️' },
  nextjs: { name: 'Next.js', icon: '▲' },
  nodejs: { name: 'Node.js', icon: '🟢' },
  python: { name: 'Python', icon: '🐍' },
  typescript: { name: 'TypeScript', icon: '📘' },
  tailwind: { name: 'Tailwind', icon: '🌊' },
  firebase: { name: 'Firebase', icon: '🔥' },
  mongodb: { name: 'MongoDB', icon: '🍃' },
  aws: { name: 'AWS', icon: '☁️' },
  docker: { name: 'Docker', icon: '🐳' },
  figma: { name: 'Figma', icon: '🎨' },
  graphql: { name: 'GraphQL', icon: '🚀' },
};

const projects = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'A full-featured online shopping platform with advanced features.',
    longDescription: 'Built a comprehensive e-commerce platform for a major retail client. The solution includes advanced product filtering, real-time inventory management, secure payment processing, and a seamless checkout experience. The platform handles thousands of concurrent users and processes hundreds of orders daily.',
    client: 'TechStyle Retail',
    category: 'E-Commerce',
    technologies: ['react', 'nodejs', 'mongodb', 'aws'],
    images: [
      'https://images.unsplash.com/photo-1661956602116-aa6865609028?w=800&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    ],
    projectUrl: 'https://example-ecommerce.com',
    completionDate: '2024-01-15',
  },
  {
    id: '2',
    title: 'AI Customer Support Bot',
    description: 'Intelligent chatbot for automated customer service.',
    longDescription: 'Developed an AI-powered customer support bot that handles 80% of customer inquiries automatically. The bot uses natural language processing to understand customer needs and provides accurate responses. Integration with existing CRM systems ensures seamless handoff to human agents when needed.',
    client: 'ServicePro Inc',
    category: 'AI Solutions',
    technologies: ['python', 'nodejs', 'firebase', 'docker'],
    images: [
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
      'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&q=80',
    ],
    projectUrl: 'https://example-chatbot.com',
    completionDate: '2024-02-20',
  },
  {
    id: '3',
    title: 'Portfolio Website',
    description: 'Elegant portfolio site for a creative agency.',
    longDescription: 'Designed and developed a stunning portfolio website for a creative agency. The site features smooth animations, a custom CMS for easy content management, and optimized performance for fast loading times. The design showcases the agency\'s work while providing an exceptional user experience.',
    client: 'Creative Studios',
    category: 'Web Development',
    technologies: ['nextjs', 'typescript', 'tailwind', 'figma'],
    images: [
      'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    ],
    projectUrl: 'https://example-portfolio.com',
    completionDate: '2024-03-10',
  },
  {
    id: '4',
    title: 'Social Media Dashboard',
    description: 'Analytics dashboard for social media management.',
    longDescription: 'Built a comprehensive social media analytics dashboard that allows businesses to track performance across multiple platforms. Features include real-time analytics, automated reporting, content scheduling, and team collaboration tools.',
    client: 'SocialBuzz Marketing',
    category: 'Web Application',
    technologies: ['react', 'nodejs', 'mongodb', 'graphql'],
    images: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
      'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80',
    ],
    projectUrl: 'https://example-dashboard.com',
    completionDate: '2024-04-05',
  },
  {
    id: '5',
    title: 'Healthcare App',
    description: 'Mobile app for patient management and telemedicine.',
    longDescription: 'Developed a HIPAA-compliant mobile application for a healthcare provider. The app enables patients to schedule appointments, access medical records, and conduct video consultations with healthcare providers. Features secure messaging and prescription management.',
    client: 'MedCare Health',
    category: 'Mobile Development',
    technologies: ['react', 'nodejs', 'aws', 'docker'],
    images: [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
      'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800&q=80',
    ],
    projectUrl: null,
    completionDate: '2024-05-12',
  },
  {
    id: '6',
    title: 'Restaurant Ordering System',
    description: 'Online ordering platform for food delivery.',
    longDescription: 'Created a complete online ordering system for a restaurant chain. The platform includes menu management, order tracking, payment processing, and integration with delivery services. Mobile-responsive design ensures a great experience across all devices.',
    client: 'FoodExpress Chain',
    category: 'E-Commerce',
    technologies: ['nextjs', 'typescript', 'firebase', 'tailwind'],
    images: [
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
    ],
    projectUrl: 'https://example-restaurant.com',
    completionDate: '2024-06-01',
  },
];

export function Projects() {
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { t } = useLanguage();

  const openProject = (project: typeof projects[0]) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (selectedProject) {
      setCurrentImageIndex((prev) =>
        (prev + 1) % selectedProject.images.length
      );
    }
  };

  const prevImage = () => {
    if (selectedProject) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + selectedProject.images.length) % selectedProject.images.length
      );
    }
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              {t('projectsTitle')}
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-3xl mx-auto"
          >
            {t('projectsSubtitle')}
          </motion.p>
        </motion.div>
      </section>

      {/* Projects Grid */}
      <section className="py-10 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 cursor-pointer"
                onClick={() => openProject(project)}
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <motion.img
                    src={project.images[0]}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                  
                  {/* Category Badge */}
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium"
                  >
                    {project.category}
                  </motion.div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tech Stack Preview */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <motion.span
                        key={tech}
                        whileHover={{ scale: 1.1 }}
                        className="px-2 py-1 rounded-md bg-muted text-xs font-medium"
                      >
                        {technologies[tech as keyof typeof technologies]?.name || tech}
                      </motion.span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2 py-1 rounded-md bg-muted text-xs font-medium">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Client */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span>{project.client}</span>
                    </div>
                    <motion.span
                      whileHover={{ x: 5 }}
                      className="flex items-center text-primary font-medium"
                    >
                      View Details
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </motion.span>
                  </div>
                </div>

                {/* Hover Effect */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-blue-600"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Detail Modal */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">{selectedProject.title}</DialogTitle>
              </DialogHeader>

              {/* Image Carousel */}
              <div className="relative mt-4 mb-6">
                <div className="relative h-64 md:h-80 rounded-xl overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImageIndex}
                      src={selectedProject.images[currentImageIndex]}
                      alt={`${selectedProject.title} - ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                    />
                  </AnimatePresence>

                  {/* Navigation */}
                  {selectedProject.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>

                {/* Image Indicators */}
                {selectedProject.images.length > 1 && (
                  <div className="flex justify-center gap-2 mt-4">
                    {selectedProject.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex ? 'bg-primary w-6' : 'bg-muted-foreground/30'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="space-y-6">
                <p className="text-muted-foreground">{selectedProject.longDescription}</p>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <User className="w-5 h-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">{t('client')}</div>
                      <div className="font-medium">{selectedProject.client}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Folder className="w-5 h-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">{t('category')}</div>
                      <div className="font-medium">{selectedProject.category}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">{t('projectDate')}</div>
                      <div className="font-medium">
                        {new Date(selectedProject.completionDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  {selectedProject.projectUrl && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <ExternalLink className="w-5 h-5 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">URL</div>
                        <a
                          href={selectedProject.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-primary hover:underline"
                        >
                          {t('visitProject')}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Technologies */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-primary" />
                    {t('technologies')}
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedProject.technologies.map((tech) => (
                      <motion.div
                        key={tech}
                        whileHover={{ scale: 1.05, y: -2 }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20"
                      >
                        <span className="text-xl">
                          {technologies[tech as keyof typeof technologies]?.icon}
                        </span>
                        <span className="font-medium text-sm">
                          {technologies[tech as keyof typeof technologies]?.name || tech}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
