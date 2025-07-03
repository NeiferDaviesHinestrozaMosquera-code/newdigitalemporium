
import ServiceCard from '@/components/shared/ServiceCard';
import type { Metadata } from 'next';
import type { Service } from '@/lib/placeholder-data';
import { db } from "@/lib/firebase/config";
import { ref, get, child } from "firebase/database";
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { i18n, type Locale } from '@/lib/i18n/i18n-config';

export async function generateMetadata({ params }: { params?: { lang?: Locale } }): Promise<Metadata> {
  const lang = params?.lang || i18n.defaultLocale;
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

export default async function ServicesPage({ params }: { params?: { lang?: Locale } }) {
  const lang = params?.lang || i18n.defaultLocale;
  const services = await getServicesFromDB();
  const dictionary = await getDictionary(lang);

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <h1 className="text-4xl md:text-5xl font-bold text-center text-primary mb-6">
        {dictionary.ourServices as string}
      </h1>
      <p className="text-lg text-muted-foreground text-center mb-12 md:mb-16 max-w-3xl mx-auto">
        {dictionary.ourServicesDescription as string}
      </p>
      {services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} lang={lang} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">No services currently available. Please check back soon!</p>
      )}
    </div>
  );
}
