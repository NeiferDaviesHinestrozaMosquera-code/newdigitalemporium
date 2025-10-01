
import type { LucideIcon } from 'lucide-react';
import { 
  Smartphone, Globe, Bot, BrainCircuit, Palette, Code2, PencilRuler, 
  SearchCode, LineChart, HelpCircle, Briefcase, Layers,
  FileText, Share2, ShoppingCart, Lightbulb, Network, BarChart3, Wrench,
  Settings, Github, Linkedin, Twitter, Facebook, Instagram, Youtube, Mail, Phone, MapPin // Added Settings and specific social icons
} from 'lucide-react';

export interface BilingualText {
  en: string;
  es: string;
  fr: string;
}

export interface AiGeneratedQuote {
  projectScope: BilingualText;
  costEstimate: BilingualText;
  additionalNotes: BilingualText;
}

// Helper para obtener un componente de icono por nombre
export const iconMap: Record<string, LucideIcon> = {
  Smartphone,
  Globe,
  Bot,
  BrainCircuit,
  Palette,
  Code2,
  PencilRuler,
  SearchCode,
  LineChart,
  Briefcase,
  Layers,
  FileText,
  Share2,
  ShoppingCart,
  Lightbulb,
  Network,
  BarChart3,
  Wrench,
  Settings, // For admin sidebar
  Github,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  HelpCircle, // Un icono por defecto
};

export const allIconNames = Object.keys(iconMap) as Array<keyof typeof iconMap>;
export const serviceIconNames = allIconNames;


export interface Service {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  iconName: keyof typeof iconMap;
  image: string;
  dataAiHint: string;
  priceInfo: string;
  slug: string;
}

export interface Testimonial {
  id: string;
  name: string;
  company?: string;
  quote: string;
  avatar?: string;
  dataAiHint: string;
}

export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  images: string[]; // Changed from image: string
  dataAiHint: string;
  technologies: string[];
  liveLink?: string;
  repoLink?: string;
  clientName?: string;
  category: string;
  iconName: keyof typeof iconMap;
}

export type ClientInquiryStatus = 'New' | 'Contacted' | 'Quoted' | 'Closed';

export interface ClientInquiry {
  id: string; 
  name: string;
  email: string;
  company?: string;
  phoneNumber?: string;
  serviceRequested: string;
  details: string;
  date: string; 
  status: ClientInquiryStatus;
  generatedQuote?: AiGeneratedQuote;
}

// New interfaces for Site Content
export interface AboutPageContent {
  pageTitle: BilingualText;
  heading: BilingualText;
  subHeading: BilingualText; // formerly aboutUsPageDescription
  section1ImageURL: string;
  section1ImageHint: string;
  section1Heading: BilingualText;
  section1Paragraph1: BilingualText;
  section1Paragraph2: BilingualText;
  missionHeading: BilingualText;
  missionText: BilingualText;
  visionHeading: BilingualText;
  visionText: BilingualText;
  valuesHeading: BilingualText;
  valuesList: BilingualText; // For a list of values, one per line
  finalSectionHeading: BilingualText;
  finalSectionText: BilingualText;
}

export interface ContactPageContent {
  pageTitle: BilingualText;
  heading: BilingualText;
  subHeading: BilingualText;
  emailLabel: BilingualText;
  emailValue: string;
  phoneLabel: BilingualText;
  phoneValue: string;
  addressLabel: BilingualText;
  addressValue: BilingualText; // The actual address string, bilingual
  ctaHeading: BilingualText;
  ctaDescription: BilingualText;
}

export interface SocialLink {
  id: string; // For react key prop, can be uuid
  name: string; // e.g., GitHub, LinkedIn - used for aria-label
  href: string;
  iconName: keyof typeof iconMap;
}

export interface SiteContent {
  aboutPage: AboutPageContent;
  contactPage: ContactPageContent;
  socialLinks: SocialLink[];
}

// Default structure for Firebase if nothing exists
export const defaultSiteContent: SiteContent = {
  aboutPage: {
    pageTitle: { en: "About Us - Digital Emporium", es: "Sobre Nosotros - Digital Emporium", fr: "À Propos de Nous - Digital Emporium" },
    heading: { en: "About Digital Emporium", es: "Sobre Digital Emporium", fr: "À Propos de Digital Emporium" },
    subHeading: { en: "Learn more about Digital Emporium, our mission, vision, and the team dedicated to your digital success.", es: "Conoce más sobre Digital Emporium, nuestra misión, visión y el equipo dedicado a tu éxito digital.", fr: "Apprenez-en plus sur Digital Emporium, notre mission, notre vision et l'équipe dédiée à votre succès numérique." },
    section1ImageURL: "https://placehold.co/800x600.png?text=Our+Team",
    section1ImageHint: "team collaboration",
    section1Heading: { en: "Welcome to Digital Emporium!", es: "¡Bienvenido a Digital Emporium!", fr: "Bienvenue chez Digital Emporium !" },
    section1Paragraph1: { en: "We are a passionate team of developers, designers, and AI specialists dedicated to crafting innovative digital solutions that empower businesses and bring creative visions to life.", es: "Somos un equipo apasionado de desarrolladores, diseñadores y especialistas en IA dedicados a crear soluciones digitales innovadoras que potencian a las empresas y dan vida a visiones creativas.", fr: "Nous sommes une équipe passionnée de développeurs, designers et spécialistes en IA dédiés à la création de solutions numériques innovantes qui autonomisent les entreprises et donnent vie aux visions créatrices." },
    section1Paragraph2: { en: "Our expertise spans across web development, mobile app creation, bespoke AI agents, and strategic digital consulting. We believe in the transformative power of technology.", es: "Nuestra experiencia abarca el desarrollo web, la creación de aplicaciones móviles, agentes de IA a medida y consultoría digital estratégica. Creemos en el poder transformador de la tecnología.", fr: "Notre expertise couvre le développement web, la création d'applications mobiles, les agents IA sur mesure et le conseil stratégique numérique. Nous croyons au pouvoir transformateur de la technologie." },
    missionHeading: { en: "Our Mission", es: "Nuestra Misión", fr: "Notre Mission" },
    missionText: { en: "To empower businesses with innovative and tailored digital solutions that drive growth, enhance engagement, and create lasting value.", es: "Empoderar a las empresas con soluciones digitales innovadoras y personalizadas que impulsan el crecimiento, mejoran el compromiso y crean valor duradero.", fr: "Donner aux entreprises les moyens de développer des solutions numériques innovantes et sur mesure qui stimulent la croissance, améliorent l'engagement et créent une valeur durable." },
    visionHeading: { en: "Our Vision", es: "Nuestra Visión", fr: "Notre Vision" },
    visionText: { en: "To be a leading digital partner, recognized for our creativity, technological excellence, and unwavering commitment to client success.", es: "Ser un socio digital líder, reconocido por nuestra creatividad, excelencia tecnológica y compromiso inquebrantable con el éxito del cliente.", fr: "Être un partenaire numérique de premier plan, reconnu pour notre créativité, notre excellence technologique et notre engagement indéfectible envers le succès de nos clients." },
    valuesHeading: { en: "Our Values", es: "Nuestros Valores", fr: "Nos Valeurs" },
    valuesList: { en: "Collaboration & Transparency\nInnovation & Excellence\nClient-Centricity\nIntegrity & Respect", es: "Colaboración y Transparencia\nInnovación y Excelencia\nEnfoque en el Cliente\nIntegridad y Respeto", fr: "Collaboration et Transparence\nInnovation et Excellence\nCentricité Client\nIntégrité et Respect" },
    finalSectionHeading: { en: "Join Us on the Digital Journey", es: "Únete a Nosotros en el Viaje Digital", fr: "Rejoignez-Nous dans l'Aventure Numérique" },
    finalSectionText: { en: "At Digital Emporium, we value collaboration and continuous learning. We work closely with our clients to understand their unique challenges and opportunities. Let's build something amazing together.", es: "En Digital Emporium, valoramos la colaboración y el aprendizaje continuo. Trabajamos de cerca con nuestros clientes para comprender sus desafíos y oportunidades únicos. Construyamos algo increíble juntos.", fr: "Chez Digital Emporium, nous valorisons la collaboration et l'apprentissage continu. Nous travaillons en étroite collaboration avec nos clients pour comprendre leurs défis et opportunités uniques. Construisons ensemble quelque chose d'incroyable." }
  },
  contactPage: {
    pageTitle: { en: "Contact Us - Digital Emporium", es: "Contáctanos - Digital Emporium", fr: "Contactez-Nous - Digital Emporium" },
    heading: { en: "Get in Touch", es: "Ponte en Contacto", fr: "Contactez-Nous" },
    subHeading: { en: "We're here to help and answer any question you might have. We look forward to hearing from you!", es: "Estamos aquí para ayudar y responder cualquier pregunta que puedas tener. ¡Esperamos tener noticias tuyas!", fr: "Nous sommes là pour vous aider et répondre à toutes vos questions. Nous avons hâte d'avoir de vos nouvelles !" },
    emailLabel: { en: "Email Us", es: "Escríbenos", fr: "Envoyez-nous un Email" },
    emailValue: "hello@digitalemporium.dev",
    phoneLabel: { en: "Call Us", es: "Llámanos", fr: "Appelez-Nous" },
    phoneValue: "+1 (555) 123-4567",
    addressLabel: { en: "Visit Us", es: "Visítanos", fr: "Rendez-Nous Visite" },
    addressValue: { en: "123 Digital Avenue, Tech City, TC 54321, Innovation Land", es: "Avenida Digital 123, Ciudad Tecnológica, TC 54321, Tierra de Innovación", fr: "123 Avenue Numérique, Ville Tech, TC 54321, Pays de l'Innovation" },
    ctaHeading: { en: "Ready to Start?", es: "Estar listo para empezar?", fr: "Prêt à Commencer ?" },
    ctaDescription: { en: "Reach out to discuss your project and get a personalized quote.", es: "Contáctanos para discutir tu proyecto y obtener una cotización personalizada.", fr: "Contactez-nous pour discuter de votre projet et obtenir un devis personnalisé." }
  },
  socialLinks: [
    { id: "1", name: "GitHub", href: "https://github.com", iconName: "Github" },
    { id: "2", name: "LinkedIn", href: "https://linkedin.com", iconName: "Linkedin" },
    { id: "3", name: "Twitter", href: "https://twitter.com", iconName: "Twitter" },
  ]
};
