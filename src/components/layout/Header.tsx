import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, Palette, ShoppingBag } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {
  isAdmin?: boolean;
}

export function Header({ isAdmin = false }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme, isDark } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: t('home'), href: '/' },
    { label: t('services'), href: '/services' },
    { label: t('projects'), href: '/projects' },
    { label: t('about'), href: '/about' },
    { label: t('contact'), href: '/contact' },
    { label: t('quote'), href: '/quote' },
  ];

  const adminNavItems = [
    { label: t('dashboard'), href: '/admin' },
    { label: t('manageServices'), href: '/admin/services' },
    { label: t('manageProjects'), href: '/admin/projects' },
    { label: t('manageTestimonials'), href: '/admin/testimonials' },
    { label: t('clientInquiries'), href: '/admin/inquiries' },
    { label: t('siteSettings'), href: '/admin/settings' },
  ];

  const handleNavClick = (href: string) => {
    navigate(href);
    setMobileMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate(isAdmin ? '/admin' : '/')}
          >
            <div className={`p-2 rounded-lg ${isDark ? 'bg-primary' : 'bg-primary/10'}`}>
              <ShoppingBag className={`w-6 h-6 ${isDark ? 'text-primary-foreground' : 'text-primary'}`} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Digital Emporium
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {(isAdmin ? adminNavItems : navItems).map((item) => (
              <motion.button
                key={item.href}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavClick(item.href)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.href
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent'
                }`}
              >
                {item.label}
              </motion.button>
            ))}
          </nav>

          {/* Right Side Controls */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative group"
            >
              <button
                className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium uppercase">{language}</span>
              </button>
              <div className="absolute top-full right-0 mt-2 py-1 bg-popover rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[100px]">
                <button
                  onClick={() => setLanguage('en')}
                  className={`w-full px-4 py-2 text-sm text-left hover:bg-accent ${language === 'en' ? 'bg-accent' : ''}`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage('es')}
                  className={`w-full px-4 py-2 text-sm text-left hover:bg-accent ${language === 'es' ? 'bg-accent' : ''}`}
                >
                  Español
                </button>
              </div>
            </motion.div>

            {/* Theme Toggle */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative group"
            >
              <button
                className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
              >
                <Palette className="w-4 h-4" />
              </button>
              <div className="absolute top-full right-0 mt-2 py-1 bg-popover rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[120px]">
                <button
                  onClick={() => setTheme('light')}
                  className={`w-full px-4 py-2 text-sm text-left hover:bg-accent ${theme === 'light' ? 'bg-accent' : ''}`}
                >
                  ☀️ Light
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`w-full px-4 py-2 text-sm text-left hover:bg-accent ${theme === 'dark' ? 'bg-accent' : ''}`}
                >
                  🌙 Dark
                </button>
                <button
                  onClick={() => setTheme('system')}
                  className={`w-full px-4 py-2 text-sm text-left hover:bg-accent ${theme === 'system' ? 'bg-accent' : ''}`}
                >
                  💻 System
                </button>
              </div>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background/95 backdrop-blur-md border-t border-border"
          >
            <nav className="flex flex-col p-4 gap-2">
              {(isAdmin ? adminNavItems : navItems).map((item) => (
                <motion.button
                  key={item.href}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavClick(item.href)}
                  className={`px-4 py-3 rounded-lg text-left font-medium transition-colors ${
                    location.pathname === item.href
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent'
                  }`}
                >
                  {item.label}
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export default Header;