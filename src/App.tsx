import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Toaster } from '@/components/ui/sonner';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Home } from '@/pages/Home';
import { Services } from '@/pages/Services';
import { Projects } from '@/pages/Projects';
import { About } from '@/pages/About';
import { Contact } from '@/pages/Contact';
import { Quote } from '@/pages/Quote';
import { Dashboard } from '@/pages/admin/Dashboard';
import { ServicesAdmin } from '@/pages/admin/ServicesAdmin';
import { ProjectsAdmin } from '@/pages/admin/ProjectsAdmin';
import { TestimonialsAdmin } from '@/pages/admin/TestimonialsAdmin';
import { ClientInquiries } from '@/pages/admin/ClientInquiries';
import { SiteSettings } from '@/pages/admin/SiteSettings';
import './App.css';

function AppContent() {
  const { pathname } = window.location;
  const isAdmin = pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header isAdmin={isAdmin} />
      <main className={isAdmin ? '' : 'pt-20'}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/quote" element={<Quote />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/services" element={<ServicesAdmin />} />
          <Route path="/admin/projects" element={<ProjectsAdmin />} />
          <Route path="/admin/testimonials" element={<TestimonialsAdmin />} />
          <Route path="/admin/inquiries" element={<ClientInquiries />} />
          <Route path="/admin/settings" element={<SiteSettings />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
      <Toaster position="top-center" />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
