import type { Metadata } from 'next';
import Image from 'next/image';
import { Users, Target, Eye } from 'lucide-react';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { i18n, type Locale } from '@/lib/i18n/i18n-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSiteContentAction } from '@/components/admin/actions'; // Import the action
import type { AboutPageContent } from '@/lib/placeholder-data';

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const siteContent = await getSiteContentAction();
  return {
    title: siteContent.aboutPage.pageTitle[lang] || "About Us",
    description: siteContent.aboutPage.subHeading[lang] || "Learn more about our company.",
  };
}

export default async function AboutUsPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang); // For UI labels if any
  const siteContent = await getSiteContentAction();
  const about = siteContent.aboutPage;

  const valuesArray = about.valuesList[lang].split('\n').filter(value => value.trim() !== '');

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <header className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 tracking-tight">
          {about.heading[lang]}
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {about.subHeading[lang]}
        </p>
      </header>

      <section className="mb-12 md:mb-16">
        <Card className="shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 items-center">
            <div className="relative h-64 md:h-full w-full">
              <Image
                src={about.section1ImageURL || "https://placehold.co/800x600.png"}
                alt={about.section1Heading[lang]}
                fill
                style={{objectFit: 'cover'}}
                data-ai-hint={about.section1ImageHint || "team"}
                className="transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div className="p-6 md:p-8 lg:p-10">
              <h2 className="text-2xl font-semibold text-primary mb-4">{about.section1Heading[lang]}</h2>
              <p className="text-foreground/80 mb-4 leading-relaxed">
                {about.section1Paragraph1[lang]}
              </p>
              <p className="text-foreground/80 leading-relaxed">
                {about.section1Paragraph2[lang]}
              </p>
            </div>
          </div>
        </Card>
      </section>

      <section className="grid md:grid-cols-3 gap-8 mb-12 md:mb-16 text-center">
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-4">
              <Target className="w-8 h-8" />
            </div>
            <CardTitle className="text-xl text-primary">{about.missionHeading[lang]}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {about.missionText[lang]}
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
             <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-4">
              <Eye className="w-8 h-8" />
            </div>
            <CardTitle className="text-xl text-primary">{about.visionHeading[lang]}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {about.visionText[lang]}
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
             <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-4">
              <Users className="w-8 h-8" />
            </div>
            <CardTitle className="text-xl text-primary">{about.valuesHeading[lang]}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground space-y-1 list-inside text-left">
              {valuesArray.map((value, index) => (
                <li key={index}>{value}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
      
      <section className="bg-secondary/30 p-6 md:p-8 rounded-lg shadow">
         <h3 className="text-2xl font-semibold text-primary mb-4 text-center">{about.finalSectionHeading[lang]}</h3>
          <p className="text-foreground/80 leading-relaxed text-center max-w-2xl mx-auto">
             {about.finalSectionText[lang]}
          </p>
      </section>

    </div>
  );
}