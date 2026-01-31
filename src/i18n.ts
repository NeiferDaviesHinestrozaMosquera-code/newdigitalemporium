import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Traducciones en Español
const translationES = {
  nav: {
    home: "Inicio",
    about: "Acerca de",
    services: "Servicios",
    portfolio: "Portafolio",
    contact: "Contacto",
    blog: "Blog"
  },
  hero: {
    title: "Bienvenido a Digital Emporium",
    subtitle: "Soluciones digitales innovadoras para tu negocio",
    cta: "Comenzar",
    learnMore: "Saber más"
  },
  services: {
    title: "Nuestros Servicios",
    subtitle: "Ofrecemos soluciones integrales para impulsar tu presencia digital",
    webDevelopment: {
      title: "Desarrollo Web",
      description: "Creamos sitios web modernos, responsivos y optimizados para SEO"
    },
    appDevelopment: {
      title: "Desarrollo de Aplicaciones",
      description: "Aplicaciones móviles nativas y multiplataforma de alta calidad"
    },
    design: {
      title: "Diseño UI/UX",
      description: "Diseños intuitivos y atractivos que mejoran la experiencia del usuario"
    },
    marketing: {
      title: "Marketing Digital",
      description: "Estrategias efectivas para aumentar tu visibilidad online"
    },
    ecommerce: {
      title: "E-commerce",
      description: "Tiendas online completas con sistemas de pago integrados"
    },
    consulting: {
      title: "Consultoría",
      description: "Asesoramiento experto en transformación digital"
    }
  },
  about: {
    title: "Sobre Nosotros",
    subtitle: "Expertos en transformación digital",
    description: "Somos un equipo de profesionales apasionados por la tecnología y la innovación.",
    mission: "Nuestra Misión",
    missionText: "Empoderar a las empresas con soluciones digitales innovadoras.",
    vision: "Nuestra Visión",
    visionText: "Ser líderes en transformación digital."
  },
  contact: {
    title: "Contáctanos",
    subtitle: "Estamos aquí para ayudarte",
    name: "Nombre",
    email: "Correo Electrónico",
    phone: "Teléfono",
    message: "Mensaje",
    subject: "Asunto",
    send: "Enviar Mensaje",
    followUs: "Síguenos"
  },
  footer: {
    company: "Empresa",
    aboutUs: "Sobre Nosotros",
    services: "Servicios",
    legal: "Legal",
    privacy: "Privacidad",
    terms: "Términos",
    rights: "Todos los derechos reservados"
  }
};

// Traducciones en Inglés
const translationEN = {
  nav: {
    home: "Home",
    about: "About",
    services: "Services",
    portfolio: "Portfolio",
    contact: "Contact",
    blog: "Blog"
  },
  hero: {
    title: "Welcome to Digital Emporium",
    subtitle: "Innovative digital solutions for your business",
    cta: "Get Started",
    learnMore: "Learn More"
  },
  services: {
    title: "Our Services",
    subtitle: "We offer comprehensive solutions to boost your digital presence",
    webDevelopment: {
      title: "Web Development",
      description: "We create modern, responsive, and SEO-optimized websites"
    },
    appDevelopment: {
      title: "App Development",
      description: "High-quality native and cross-platform mobile applications"
    },
    design: {
      title: "UI/UX Design",
      description: "Intuitive and attractive designs that enhance user experience"
    },
    marketing: {
      title: "Digital Marketing",
      description: "Effective strategies to increase your online visibility"
    },
    ecommerce: {
      title: "E-commerce",
      description: "Complete online stores with integrated payment systems"
    },
    consulting: {
      title: "Consulting",
      description: "Expert advice on digital transformation"
    }
  },
  about: {
    title: "About Us",
    subtitle: "Digital transformation experts",
    description: "We are a team of professionals passionate about technology and innovation.",
    mission: "Our Mission",
    missionText: "To empower businesses with innovative digital solutions.",
    vision: "Our Vision",
    visionText: "To be leaders in digital transformation."
  },
  contact: {
    title: "Contact Us",
    subtitle: "We're here to help",
    name: "Name",
    email: "Email",
    phone: "Phone",
    message: "Message",
    subject: "Subject",
    send: "Send Message",
    followUs: "Follow Us"
  },
  footer: {
    company: "Company",
    aboutUs: "About Us",
    services: "Services",
    legal: "Legal",
    privacy: "Privacy",
    terms: "Terms",
    rights: "All rights reserved"
  }
};

// Traducciones en Francés
const translationFR = {
  nav: {
    home: "Accueil",
    about: "À propos",
    services: "Services",
    portfolio: "Portfolio",
    contact: "Contact",
    blog: "Blog"
  },
  hero: {
    title: "Bienvenue chez Digital Emporium",
    subtitle: "Solutions numériques innovantes pour votre entreprise",
    cta: "Commencer",
    learnMore: "En savoir plus"
  },
  services: {
    title: "Nos Services",
    subtitle: "Nous proposons des solutions complètes pour renforcer votre présence numérique",
    webDevelopment: {
      title: "Développement Web",
      description: "Nous créons des sites web modernes, réactifs et optimisés pour le SEO"
    },
    appDevelopment: {
      title: "Développement d'Applications",
      description: "Applications mobiles natives et multiplateformes de haute qualité"
    },
    design: {
      title: "Design UI/UX",
      description: "Designs intuitifs et attrayants qui améliorent l'expérience utilisateur"
    },
    marketing: {
      title: "Marketing Digital",
      description: "Stratégies efficaces pour augmenter votre visibilité en ligne"
    },
    ecommerce: {
      title: "E-commerce",
      description: "Boutiques en ligne complètes avec systèmes de paiement intégrés"
    },
    consulting: {
      title: "Conseil",
      description: "Conseils d'experts en transformation numérique"
    }
  },
  about: {
    title: "À Propos de Nous",
    subtitle: "Experts en transformation numérique",
    description: "Nous sommes une équipe de professionnels passionnés par la technologie.",
    mission: "Notre Mission",
    missionText: "Autonomiser les entreprises avec des solutions numériques innovantes.",
    vision: "Notre Vision",
    visionText: "Être leaders en transformation numérique."
  },
  contact: {
    title: "Contactez-nous",
    subtitle: "Nous sommes là pour vous aider",
    name: "Nom",
    email: "Email",
    phone: "Téléphone",
    message: "Message",
    subject: "Sujet",
    send: "Envoyer le Message",
    followUs: "Suivez-nous"
  },
  footer: {
    company: "Entreprise",
    aboutUs: "À Propos",
    services: "Services",
    legal: "Légal",
    privacy: "Confidentialité",
    terms: "Conditions",
    rights: "Tous droits réservés"
  }
};

// Traducciones en Alemán
const translationDE = {
  nav: {
    home: "Startseite",
    about: "Über uns",
    services: "Dienstleistungen",
    portfolio: "Portfolio",
    contact: "Kontakt",
    blog: "Blog"
  },
  hero: {
    title: "Willkommen bei Digital Emporium",
    subtitle: "Innovative digitale Lösungen für Ihr Unternehmen",
    cta: "Loslegen",
    learnMore: "Mehr erfahren"
  },
  services: {
    title: "Unsere Dienstleistungen",
    subtitle: "Wir bieten umfassende Lösungen zur Stärkung Ihrer digitalen Präsenz",
    webDevelopment: {
      title: "Webentwicklung",
      description: "Wir erstellen moderne, responsive und SEO-optimierte Websites"
    },
    appDevelopment: {
      title: "App-Entwicklung",
      description: "Hochwertige native und plattformübergreifende mobile Anwendungen"
    },
    design: {
      title: "UI/UX-Design",
      description: "Intuitive und attraktive Designs"
    },
    marketing: {
      title: "Digitales Marketing",
      description: "Effektive Strategien zur Steigerung Ihrer Online-Sichtbarkeit"
    },
    ecommerce: {
      title: "E-Commerce",
      description: "Vollständige Online-Shops mit integrierten Zahlungssystemen"
    },
    consulting: {
      title: "Beratung",
      description: "Expertenberatung zur digitalen Transformation"
    }
  },
  about: {
    title: "Über Uns",
    subtitle: "Experten für digitale Transformation",
    description: "Wir sind ein Team von Fachleuten, die von Technologie begeistert sind.",
    mission: "Unsere Mission",
    missionText: "Unternehmen mit innovativen digitalen Lösungen zu befähigen.",
    vision: "Unsere Vision",
    visionText: "Führend in der digitalen Transformation zu sein."
  },
  contact: {
    title: "Kontaktieren Sie uns",
    subtitle: "Wir sind hier, um zu helfen",
    name: "Name",
    email: "E-Mail",
    phone: "Telefon",
    message: "Nachricht",
    subject: "Betreff",
    send: "Nachricht senden",
    followUs: "Folgen Sie uns"
  },
  footer: {
    company: "Unternehmen",
    aboutUs: "Über uns",
    services: "Dienstleistungen",
    legal: "Rechtliches",
    privacy: "Datenschutz",
    terms: "Bedingungen",
    rights: "Alle Rechte vorbehalten"
  }
};

// Traducciones en Portugués
const translationPT = {
  nav: {
    home: "Início",
    about: "Sobre",
    services: "Serviços",
    portfolio: "Portfólio",
    contact: "Contato",
    blog: "Blog"
  },
  hero: {
    title: "Bem-vindo ao Digital Emporium",
    subtitle: "Soluções digitais inovadoras para o seu negócio",
    cta: "Começar",
    learnMore: "Saiba mais"
  },
  services: {
    title: "Nossos Serviços",
    subtitle: "Oferecemos soluções abrangentes para impulsionar sua presença digital",
    webDevelopment: {
      title: "Desenvolvimento Web",
      description: "Criamos sites modernos, responsivos e otimizados para SEO"
    },
    appDevelopment: {
      title: "Desenvolvimento de Aplicativos",
      description: "Aplicativos móveis nativos e multiplataforma de alta qualidade"
    },
    design: {
      title: "Design UI/UX",
      description: "Designs intuitivos e atraentes"
    },
    marketing: {
      title: "Marketing Digital",
      description: "Estratégias eficazes para aumentar sua visibilidade online"
    },
    ecommerce: {
      title: "E-commerce",
      description: "Lojas online completas com sistemas de pagamento integrados"
    },
    consulting: {
      title: "Consultoria",
      description: "Aconselhamento especializado em transformação digital"
    }
  },
  about: {
    title: "Sobre Nós",
    subtitle: "Especialistas em transformação digital",
    description: "Somos uma equipe de profissionais apaixonados por tecnologia.",
    mission: "Nossa Missão",
    missionText: "Capacitar empresas com soluções digitais inovadoras.",
    vision: "Nossa Visão",
    visionText: "Ser líderes em transformação digital."
  },
  contact: {
    title: "Entre em Contato",
    subtitle: "Estamos aqui para ajudar",
    name: "Nome",
    email: "E-mail",
    phone: "Telefone",
    message: "Mensagem",
    subject: "Assunto",
    send: "Enviar Mensagem",
    followUs: "Siga-nos"
  },
  footer: {
    company: "Empresa",
    aboutUs: "Sobre Nós",
    services: "Serviços",
    legal: "Legal",
    privacy: "Privacidade",
    terms: "Termos",
    rights: "Todos os direitos reservados"
  }
};

// Recursos de traducción
const resources = {
  es: { translation: translationES },
  en: { translation: translationEN },
  fr: { translation: translationFR },
  de: { translation: translationDE },
  pt: { translation: translationPT }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    debug: false,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    }
  });

export default i18n;
