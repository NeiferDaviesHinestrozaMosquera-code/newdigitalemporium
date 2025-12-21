import ServiceCard from '@/components/shared/ServiceCard';
import ServiceCarousel from '@/components/shared/ServiceCarousel';
import ScrollReveal from '@/components/shared/ScrollReveal';
import type { Metadata } from 'next';
import type { Service } from '@/lib/placeholder-data';
import { db } from "@/lib/firebase/config";
import { ref, get, child } from "firebase/database";
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { i18n, type Locale } from '@/lib/i18n/i18n-config';

// CORRECCIÓN: Await params antes de usar sus propiedades
export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  return {
    title: dictionary.servicesPageTitle as string,
    description: dictionary.servicesPageDescription as string,
  };
}

async function getServicesFromDB(): Promise<Service[]> {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `services`));
    if (snapshot.exists()) {
      const servicesObject = snapshot.val();
      const servicesArray = Object.keys(servicesObject)
        .map(key => ({ id: key, ...servicesObject[key] }))
        .sort((a, b) => a.title.localeCompare(b.title)); 
      return servicesArray as Service[];
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching services from Firebase DB for public page:", error);
    return [];
  }
}

// CORRECCIÓN: Tipo actualizado con Promise y await params
export default async function ServicesPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const services = await getServicesFromDB();
  const dictionary = await getDictionary(lang);

  // Get service images for carousel
  const serviceImages = services
    .filter(service => service.image)
    .slice(0, 5)
    .map(service => service.image);

  return (
    <div className="w-full">
      {/* Hero Section with Carousel */}
      {serviceImages.length > 0 && (
        <section className="py-12 md:py-16 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4">
            <ScrollReveal direction="up" delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-2">
                {dictionary.ourServices as string}
              </h2>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.2}>
              <p className="text-lg text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
                {dictionary.ourServicesDescription as string}
              </p>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.3}>
              <ServiceCarousel 
                images={serviceImages} 
                title="Our Services"
                className="rounded-xl overflow-hidden"
              />
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Services Grid */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <ScrollReveal direction="up" delay={0.1}>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-4">
            All Services
          </h2>
        </ScrollReveal>
        <ScrollReveal direction="up" delay={0.2}>
          <p className="text-lg text-muted-foreground text-center mb-12 md:mb-16 max-w-3xl mx-auto">
            Explore our complete range of digital solutions tailored to your business needs.
          </p>
        </ScrollReveal>

        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ScrollReveal 
                key={service.id} 
                direction={index % 2 === 0 ? "left" : "right"}
                delay={0.1 * (index % 3)}
              >
                <ServiceCard service={service} lang={lang} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No services currently available. Please check back soon!</p>
        )}
      </section>
    </div>
  );
}
