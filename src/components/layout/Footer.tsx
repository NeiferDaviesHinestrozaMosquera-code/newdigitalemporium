import { motion } from 'framer-motion';
import { ShoppingBag, Mail, Phone, MapPin, Github, Linkedin, Twitter, Facebook, Instagram, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

export function Footer() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isDark } = useTheme();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="bg-gradient-to-b from-background to-muted/30 border-t border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${isDark ? 'bg-primary' : 'bg-primary/10'}`}>
                <ShoppingBag className={`w-6 h-6 ${isDark ? 'text-primary-foreground' : 'text-primary'}`} />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Digital Emporium
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              Transforming ideas into digital reality. We provide cutting-edge solutions for your business needs.
            </p>
            <div className="flex gap-3">
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-accent hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Github className="w-4 h-4" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-accent hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-accent hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-accent hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-accent hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{t('home')}</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => { navigate('/services'); scrollToTop(); }}
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {t('services')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => { navigate('/projects'); scrollToTop(); }}
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {t('projects')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => { navigate('/about'); scrollToTop(); }}
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {t('about')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => { navigate('/contact'); scrollToTop(); }}
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {t('contact')}
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">{t('services')}</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-muted-foreground text-sm">Web Development</span>
              </li>
              <li>
                <span className="text-muted-foreground text-sm">Mobile Apps</span>
              </li>
              <li>
                <span className="text-muted-foreground text-sm">AI & Bot Solutions</span>
              </li>
              <li>
                <span className="text-muted-foreground text-sm">Digital Marketing</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">{t('contact')}</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground text-sm">contact@digitalemporium.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <span className="text-muted-foreground text-sm">
                  123 Tech Street<br />
                  San Francisco, CA 94105
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 Digital Emporium. All rights reserved.
          </p>
          <div className="flex gap-4">
            <button className="text-muted-foreground hover:text-primary transition-colors text-sm">
              Privacy Policy
            </button>
            <button className="text-muted-foreground hover:text-primary transition-colors text-sm">
              Terms of Service
            </button>
          </div>
        </div>
      </div>

      {/* WhatsApp Float Button */}
      <motion.a
        href="https://wa.me/15551234567"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        className="fixed bottom-6 right-6 z-50 p-4 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.a>
    </motion.footer>
  );
}
