
import { QuoteRequestForm } from "@/components/forms/QuoteRequestForm";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { Locale } from "@/lib/i18n/i18n-config";
import { fetchAvailableServices } from "@/lib/placeholder-data";

interface QuoteRequestPageProps {
  params: Promise<{
    lang: Locale;
  }>;
}

export default async function QuoteRequestPage({ params }: QuoteRequestPageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const availableServices = await fetchAvailableServices();

  const formLabels = {
    submitting: dictionary.quoteRequest.form.submitting,
    sendRequest: dictionary.quoteRequest.form.sendRequest,
  };

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">
          {dictionary.quoteRequest.title}
        </h1>
        <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-12">
          {dictionary.quoteRequest.description}
        </p>
        <div className="max-w-2xl mx-auto">
          <QuoteRequestForm
            availableServices={availableServices}
            lang={lang}
            labels={formLabels}
          />
        </div>
      </div>
    </section>
  );
}
