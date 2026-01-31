import React, { createContext, useContext, useState } from 'react';

type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  es: {
    // Navigation
    home: 'Inicio',
    services: 'Servicios',
    projects: 'Proyectos',
    about: 'Nosotros',
    contact: 'Contacto',
    quote: 'Cotizar',
    admin: 'Admin',
    
    // Hero
    heroTitle1: 'Transformamos Ideas en',
    heroTitle2: 'Soluciones Digitales',
    heroSubtitle: 'Potenciamos tu negocio con tecnología de vanguardia, diseño excepcional y estrategias digitales innovadoras.',
    getStarted: 'Comenzar',
    learnMore: 'Saber Más',
    
    // Services
    servicesTitle: 'Nuestros Servicios',
    servicesSubtitle: 'Ofrecemos una suite completa de servicios digitales para elevar tu negocio.',
    viewDetails: 'Ver Detalles',
    
    // Projects
    projectsTitle: 'Nuestros Proyectos',
    projectsSubtitle: 'Descubre las soluciones innovadoras e impactantes que hemos entregado a nuestros clientes. Cada proyecto refleja nuestro compromiso con la calidad, creatividad y tecnología de vanguardia.',
    client: 'Cliente',
    category: 'Categoría',
    technologies: 'Tecnologías',
    projectDate: 'Fecha',
    visitProject: 'Visitar Proyecto',
    
    // About
    aboutTitle: 'Sobre Nosotros',
    aboutSubtitle: 'Conoce nuestra historia y lo que nos impulsa.',
    welcomeTitle: '¡Bienvenido a Digital Emporium!',
    welcomeText: 'Somos un equipo apasionado de desarrolladores, diseñadores y especialistas en IA dedicados a crear soluciones digitales innovadoras que potencian los negocios y dan vida a las visiones creativas. Nuestra experiencia abarca el desarrollo web, la creación de aplicaciones móviles, agentes de IA personalizados y consultoría digital estratégica. Creemos en el poder transformador de la tecnología.',
    mission: 'Misión',
    vision: 'Visión',
    values: 'Valores',
    missionText: 'Proporcionar soluciones digitales excepcionales que impulsen el crecimiento y éxito de nuestros clientes mediante tecnología innovadora y un servicio excepcional.',
    visionText: 'Ser la empresa líder en soluciones digitales, reconocida por nuestra excelencia, innovación y compromiso con el éxito de nuestros clientes.',
    valuesText: 'Integridad, Innovación, Compromiso, Excelencia, Colaboración',
    
    // Contact
    contactTitle: 'Contáctanos',
    contactSubtitle: '¿Listo para iniciar tu proyecto? Estamos aquí para ayudarte.',
    email: 'Correo Electrónico',
    phone: 'Teléfono',
    address: 'Dirección',
    requestQuote: 'Solicitar Cotización',
    
    // Quote
    quoteTitle: 'Solicita una Cotización',
    quoteSubtitle: 'Cuéntanos sobre tu proyecto y te enviaremos una propuesta personalizada.',
    fullName: 'Nombre Completo',
    company: 'Nombre de la Empresa (Opcional)',
    serviceInterested: 'Servicio de Interés',
    projectDetails: 'Detalles del Proyecto',
    submit: 'Enviar Solicitud',
    
    // Admin
    dashboard: 'Panel',
    manageServices: 'Gestionar Servicios',
    manageProjects: 'Gestionar Proyectos',
    manageTestimonials: 'Gestionar Testimonios',
    clientInquiries: 'Consultas de Clientes',
    siteSettings: 'Configuración del Sitio',
    statistics: 'Estadísticas',
    
    // Form validations
    required: 'Este campo es requerido',
    invalidEmail: 'Correo electrónico inválido',
    
    // Status
    status: 'Estado',
    pending: 'Pendiente',
    reviewed: 'Revisado',
    quoted: 'Cotizado',
    approved: 'Aprobado',
    rejected: 'Rechazado',
  },
  en: {
    // Navigation
    home: 'Home',
    services: 'Services',
    projects: 'Projects',
    about: 'About Us',
    contact: 'Contact',
    quote: 'Request a Quote',
    admin: 'Admin',
    
    // Hero
    heroTitle1: 'We Transform Ideas Into',
    heroTitle2: 'Digital Solutions',
    heroSubtitle: 'We empower your business with cutting-edge technology, exceptional design, and innovative digital strategies.',
    getStarted: 'Get Started',
    learnMore: 'Learn More',
    
    // Services
    servicesTitle: 'Our Services',
    servicesSubtitle: 'We offer a comprehensive suite of digital services to elevate your business.',
    viewDetails: 'View Details',
    
    // Projects
    projectsTitle: 'Our Projects',
    projectsSubtitle: 'Discover the innovative solutions and impactful projects we\'ve delivered for our clients. Each project reflects our commitment to quality, creativity, and cutting-edge technology.',
    client: 'Client',
    category: 'Category',
    technologies: 'Technologies',
    projectDate: 'Date',
    visitProject: 'Visit Project',
    
    // About
    aboutTitle: 'About Us',
    aboutSubtitle: 'Learn our story and what drives us.',
    welcomeTitle: 'Welcome to Digital Emporium!',
    welcomeText: 'We are a passionate team of developers, designers, and AI specialists dedicated to crafting innovative digital solutions that empower businesses and bring creative visions to life. Our expertise spans across web development, mobile app creation, bespoke AI agents, and strategic digital consulting. We believe in the transformative power of technology.',
    mission: 'Mission',
    vision: 'Vision',
    values: 'Values',
    missionText: 'To provide exceptional digital solutions that drive growth and success for our clients through innovative technology and outstanding service.',
    visionText: 'To be the leading digital solutions company, recognized for our excellence, innovation, and commitment to client success.',
    valuesText: 'Integrity, Innovation, Commitment, Excellence, Collaboration',
    
    // Contact
    contactTitle: 'Contact Us',
    contactSubtitle: 'Ready to start your project? We\'re here to help.',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    requestQuote: 'Request a Quote',
    
    // Quote
    quoteTitle: 'Request a Quote',
    quoteSubtitle: 'Tell us about your project and we\'ll send you a personalized proposal.',
    fullName: 'Full Name',
    company: 'Company Name (Optional)',
    serviceInterested: 'Service of Interest',
    projectDetails: 'Project Details',
    submit: 'Submit Request',
    
    // Admin
    dashboard: 'Dashboard',
    manageServices: 'Manage Services',
    manageProjects: 'Manage Projects',
    manageTestimonials: 'Manage Testimonials',
    clientInquiries: 'Client Inquiries',
    siteSettings: 'Site Settings',
    statistics: 'Statistics',
    
    // Form validations
    required: 'This field is required',
    invalidEmail: 'Invalid email address',
    
    // Status
    status: 'Status',
    pending: 'Pending',
    reviewed: 'Reviewed',
    quoted: 'Quoted',
    approved: 'Approved',
    rejected: 'Rejected',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('language') as Language) || 'en';
    }
    return 'en';
  });

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations.es] || key;
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
