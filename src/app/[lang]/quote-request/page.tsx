import QuoteRequestForm from '@/components/forms/QuoteRequestForm';
import type { Metadata } from 'next';
import type { Service } from '@/lib/placeholder-data';
import { db } from "@/lib/firebase/config";
import { ref, get, child } from "firebase/database";
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { i18n, type Locale } from '@/lib/i18n/i18n-config';

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  return {
    title: dictionary.requestQuotePageTitle as string,
    description: dictionary.requestQuotePageDescription as string,
  };
}

async function getServicesForDropdown(): Promise<Service[]> {
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
    console.error("Error fetching services for quote form from Firebase DB:", error);
    return []; 
  }
}


export default async function QuoteRequestPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const services = await getServicesForDropdown();
  const dictionary = await getDictionary(lang);

  const formLabels = {
      submitting: dictionary.quoteFormSubmitting as string,
      sendRequest: dictionary.quoteFormSendRequest as string,
  };
  
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          {dictionary.requestQuotePageHeading as string}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {dictionary.requestQuotePageSubheading as string}
        </p>
      </div>
      <QuoteRequestForm availableServices={services} lang={lang} labels={formLabels} />
    </div>
  );
}