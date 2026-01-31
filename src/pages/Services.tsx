import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Code, Bot, Smartphone, Megaphone, PenTool, ShoppingCart,
  Share2, Palette, Globe, Database, Cloud, Lock,
  ArrowRight, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';

const services = [
  {
    id: '1',
    title: 'Web Development',
    description: 'Custom websites built with modern technologies and best practices.',
    longDescription: 'We create stunning, responsive websites using the latest technologies like React, Next.js, and Vue. Our web development services include everything from simple landing pages to complex web applications with advanced functionality.',
    icon: Code,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    price: 'From $2,500',
    features: ['Responsive Design', 'SEO Optimization', 'Fast Performance', 'Modern Tech Stack', 'CMS Integration'],
  },
  {
    id: '2',
    title: 'AI & Bot Solutions',
    description: 'Intelligent automation systems powered by artificial intelligence.',
    longDescription: 'Transform your business operations with our AI-powered solutions. We develop custom chatbots, virtual assistants, and automation systems that streamline processes and enhance customer experience.',
    icon: Bot,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    price: 'From $3,000',
    features: ['Custom AI Models', 'Chatbot Development', 'Process Automation', 'ML Integration', '24/7 Support'],
  },
  {
    id: '3',
    title: 'Mobile App Development',
    description: 'Native and cross-platform mobile applications.',
    longDescription: 'Bring your ideas to life with our mobile app development services. We create intuitive, high-performance apps for iOS and Android using React Native and Flutter.',
    icon: Smartphone,
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
    price: 'From $5,000',
    features: ['iOS & Android', 'React Native', 'Flutter', 'App Store Publishing', 'Push Notifications'],
  },
  {
    id: '4',
    title: 'Digital Marketing',
    description: 'Strategic campaigns to boost your online presence.',
    longDescription: 'Grow your business with data-driven digital marketing strategies. We offer SEO, PPC, social media marketing, and content marketing services tailored to your goals.',
    icon: Megaphone,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    price: 'From $1,000/month',
    features: ['SEO Strategy', 'PPC Campaigns', 'Social Media', 'Content Marketing', 'Analytics'],
  },
  {
    id: '5',
    title: 'Content & Copywriting',
    description: 'Compelling content that engages and converts.',
    longDescription: 'Our expert copywriters create persuasive content that resonates with your audience. From website copy to blog posts and marketing materials, we craft words that work.',
    icon: PenTool,
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80',
    price: 'From $100/page',
    features: ['Website Copy', 'Blog Writing', 'SEO Content', 'Brand Voice', 'Editing'],
  },
  {
    id: '6',
    title: 'E-Commerce Solutions',
    description: 'Complete online store development and optimization.',
    longDescription: 'Build a profitable online store with our e-commerce solutions. We work with Shopify, WooCommerce, and custom platforms to create shopping experiences that convert.',
    icon: ShoppingCart,
    image: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?w=800&q=80',
    price: 'From $3,500',
    features: ['Shopify/WooCommerce', 'Payment Integration', 'Inventory Management', 'Mobile Commerce', 'Analytics'],
  },
  {
    id: '7',
    title: 'Social Media Management',
    description: 'Build and engage your community online.',
    longDescription: 'Let us handle your social media presence while you focus on your business. We create content, manage engagement, and grow your following across all platforms.',
    icon: Share2,
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80',
    price: 'From $800/month',
    features: ['Content Creation', 'Community Management', 'Analytics', 'Ad Management', 'Strategy'],
  },
  {
    id: '8',
    title: 'UI/UX Design',
    description: 'Beautiful interfaces with exceptional user experience.',
    longDescription: 'Create products users love with our UI/UX design services. We research, design, and test interfaces that are both beautiful and functional.',
    icon: Palette,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    price: 'From $2,000',
    features: ['User Research', 'Wireframing', 'Prototyping', 'Visual Design', 'Usability Testing'],
  },
  {
    id: '9',
    title: 'Cloud Services',
    description: 'Scalable cloud infrastructure and deployment.',
    longDescription: 'Move your business to the cloud with our comprehensive cloud services. We handle migration, optimization, and ongoing management of cloud infrastructure.',
    icon: Cloud,
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80',
    price: 'From $1,500',
    features: ['AWS/Azure/GCP', 'Migration', 'Optimization', 'Monitoring', 'Security'],
  },
  {
    id: '10',
    title: 'Database Solutions',
    description: 'Efficient data management and optimization.',
    longDescription: 'Optimize your data infrastructure with our database services. We design, implement, and maintain databases that scale with your business.',
    icon: Database,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    price: 'From $2,000',
    features: ['Database Design', 'Performance Tuning', 'Migration', 'Backup Solutions', 'Consulting'],
  },
  {
    id: '11',
    title: 'Web Security',
    description: 'Protect your digital assets from threats.',
    longDescription: 'Secure your online presence with our comprehensive security services. We offer vulnerability assessments, penetration testing, and ongoing security monitoring.',
    icon: Lock,
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
    price: 'From $1,500',
    features: ['Security Audits', 'SSL Setup', 'Firewall Config', 'Monitoring', 'Incident Response'],
  },
  {
    id: '12',
    title: 'Domain & Hosting',
    description: 'Complete web presence management.',
    longDescription: 'Get everything you need to launch your website. We offer domain registration, hosting setup, and ongoing maintenance services.',
    icon: Globe,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    price: 'From $200/year',
    features: ['Domain Registration', 'Hosting Setup', 'SSL Certificates', 'Email Setup', 'Maintenance'],
  },
];

export function Services() {
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);
  const { t } = useLanguage();

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
              {t('servicesTitle')}
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            {t('servicesSubtitle')}
          </motion.p>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section className="py-10 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -10 }}
                className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedService(service)}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <motion.img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    whileHover={{ scale: 1, rotate: 0 }}
                    className="absolute top-4 right-4 w-12 h-12 rounded-xl bg-primary/90 flex items-center justify-center shadow-lg"
                  >
                    <service.icon className="w-6 h-6 text-primary-foreground" />
                  </motion.div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-semibold">{service.price}</span>
                    <motion.span
                      whileHover={{ x: 5 }}
                      className="flex items-center text-sm text-muted-foreground group-hover:text-primary transition-colors"
                    >
                      {t('viewDetails')}
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </motion.span>
                  </div>
                </div>

                {/* Hover Effect Border */}
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

      {/* Service Detail Modal */}
      <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedService && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <selectedService.icon className="w-6 h-6 text-primary" />
                  </div>
                  {selectedService.title}
                </DialogTitle>
              </DialogHeader>
              
              <div className="mt-4">
                <motion.img
                  src={selectedService.image}
                  alt={selectedService.title}
                  className="w-full h-64 object-cover rounded-xl mb-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
                
                <p className="text-muted-foreground mb-6">{selectedService.longDescription}</p>
                
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Key Features</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedService.features.map((feature, index) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-2"
                      >
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                  <div>
                    <span className="text-sm text-muted-foreground">Starting from</span>
                    <div className="text-2xl font-bold text-primary">{selectedService.price}</div>
                  </div>
                  <Button
                    onClick={() => {
                      setSelectedService(null);
                    }}
                  >
                    Get Quote
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
