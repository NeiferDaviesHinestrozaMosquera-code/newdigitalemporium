
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { i18n, type Locale } from '@/lib/i18n/i18n-config';
import GoBackButton from '@/components/shared/GoBackButton';

export default async function NotFoundPage({ params }: { params?: { lang?: Locale } }) {
  const lang = params?.lang || i18n.defaultLocale;
  const dictionary = await getDictionary(lang);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary/20 text-center p-6">
      <div className="max-w-md w-full">
        <Image
          src="/images/404-panda.png" 
          alt="Panda triste con un portátil mostrando un error 404"
          width={600} 
          height={338}
          className="mb-8 rounded-lg shadow-xl"
          priority
        />
        <h1 className="text-5xl md:text-7xl font-bold text-primary mb-4">
          {dictionary.pageNotFoundTitle as string}
        </h1>
        <p className="text-xl md:text-2xl text-foreground/80 mb-3">
          {dictionary.pageNotFoundMessage1 as string}
        </p>
        <p className="text-md text-muted-foreground mb-8">
          {dictionary.pageNotFoundMessage2 as string}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href={`/${lang}/`}>
              <Home className="mr-2 h-5 w-5" />
              {dictionary.goToHomepage as string}
            </Link>
          </Button>
          <GoBackButton label={dictionary.goBack as string} />
        </div>
      </div>
    </div>
  );
}
