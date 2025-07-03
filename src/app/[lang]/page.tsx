
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { Service, Testimonial } from '@/lib/placeholder-data';
import ServiceCard from '@/components/shared/ServiceCard';
import TestimonialCard from '@/components/shared/TestimonialCard';
import { ArrowRight, Zap } from 'lucide-react';
import type { Metadata } from 'next';
import { db } from "@/lib/firebase/config";
import { ref, get, child, limitToFirst, query as firebaseQuery } from "firebase/database";
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { i18n, type Locale } from '@/lib/i18n/i18n-config';

export async function generateMetadata({ params }: { params?: { lang?: Locale } }): Promise<Metadata> {
  const lang = params?.lang || i18n.defaultLocale;
  const dictionary = await getDictionary(lang);
  return {
    title: dictionary.heroTitle as string || 'Digital Emporium - Innovative Digital Solutions',
    description: dictionary.heroSubtitle as string || 'Digital Emporium offers web and app development, AI bots, and custom agent creation to elevate your business.',
  };
}

async function getHomePageData(): Promise<{ services: Service[], testimonials: Testimonial[] }> {
  try {
    const dbRef = ref(db);
    
    const servicesQueryInstance = firebaseQuery(child(dbRef, 'services'), limitToFirst(3));
    const servicesSnapshot = await get(servicesQueryInstance);
    let services: Service[] = [];
    if (servicesSnapshot.exists()) {
      const servicesObject = servicesSnapshot.val();
      services = Object.keys(servicesObject).map(key => ({ id: key, ...servicesObject[key] }));
    }

    const testimonialsQueryInstance = firebaseQuery(child(dbRef, 'testimonials'), limitToFirst(3));
    const testimonialsSnapshot = await get(testimonialsQueryInstance);
    let testimonials: Testimonial[] = [];
    if (testimonialsSnapshot.exists()) {
      const testimonialsObject = testimonialsSnapshot.val();
      testimonials = Object.keys(testimonialsObject).map(key => ({ id: key, ...testimonialsObject[key] }));
    }
    
    return { services: services as Service[], testimonials: testimonials as Testimonial[] };
  } catch (error) {
    console.error("Error fetching homepage data from Firebase DB:", error);
    return { services: [], testimonials: [] };
  }
}


export default async function HomePage({ params }: { params?: { lang?: Locale } }) {
  const lang = params?.lang || i18n.defaultLocale;
  const { services, testimonials } = await getHomePageData();
  const dictionary = await getDictionary(lang);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary/5 via-background to-background overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block mb-6 animate-in fade-in zoom-in duration-500">
            <Zap className="w-16 h-16 text-accent transition-transform hover:scale-110 duration-300" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-primary mb-6 animate-in fade-in slide-in-from-bottom-10 duration-700">
            {dictionary.heroTitle as string}
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-10 delay-200 duration-700">
            {dictionary.heroSubtitle as string}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <div className="animate-in fade-in slide-in-from-left-12 duration-700 delay-400">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg text-lg w-full sm:w-auto">
                <Link href={`/${lang}/services`}>{dictionary.exploreServices as string}</Link>
              </Button>
            </div>
            <div className="animate-in fade-in slide-in-from-right-12 duration-700 delay-500">
              <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/5 hover:text-primary px-8 py-3 rounded-lg text-lg w-full sm:w-auto">
                <Link href={`/${lang}/quote-request`}>{dictionary.getAQuote as string}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 md:py-24 bg-background overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-4 animate-in fade-in slide-in-from-bottom-5 duration-500">{dictionary.ourServices as string}</h2>
          <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-5 delay-100 duration-500">
            {dictionary.ourServicesDescription as string}
          </p>
          {services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => ( 
                <div key={service.id} className={`animate-in fade-in slide-in-from-bottom-10 duration-500`} style={{ animationDelay: `${index * 150 + 200}ms` }}>
                  <ServiceCard service={service} lang={lang} />
                </div>
              ))}
            </div>
            ) : <p className="text-center text-muted-foreground">No services to display currently.</p>
          }
          <div className="text-center mt-12 animate-in fade-in zoom-in delay-500 duration-500">
            <Button asChild variant="link" className="text-accent hover:text-accent/80 text-lg">
              <Link href={`/${lang}/services`}>
                {dictionary.viewAllServices as string} <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 md:py-24 bg-secondary/20 overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-4 animate-in fade-in slide-in-from-bottom-5 duration-500">{dictionary.whatOurClientsSay as string}</h2>
          <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-5 delay-100 duration-500">
            {dictionary.clientsSayDescription as string}
          </p>
          {testimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={testimonial.id} className={`animate-in fade-in slide-in-from-bottom-10 duration-500`} style={{ animationDelay: `${index * 150 + 200}ms` }}>
                  <TestimonialCard testimonial={testimonial} />
                </div>
              ))}
            </div>
             ) : <p className="text-center text-muted-foreground">No testimonials to display currently.</p>
          }
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-5 duration-500">{dictionary.readyToStart as string}</h2>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-5 delay-100 duration-500">
            {dictionary.readyToStartDescription as string}
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-10 py-4 rounded-lg text-xl animate-in fade-in zoom-in delay-300 duration-500">
            <Link href={`/${lang}/quote-request`}>{dictionary.requestAQuoteNow as string}</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
