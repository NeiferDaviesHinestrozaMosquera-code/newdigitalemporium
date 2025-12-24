"use client";
import { QuoteRequestForm } from "@/components/forms/QuoteRequestForm";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { Locale } from "@/lib/i18n/i18n-config";

export default async function ContactPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">
          {dictionary.contact.title}
        </h1>
        <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-12">
          {dictionary.contact.description}
        </p>
        <div className="max-w-2xl mx-auto">
          <QuoteRequestForm dictionary={dictionary} />
        </div>
      </div>
    </section>
  );
}
