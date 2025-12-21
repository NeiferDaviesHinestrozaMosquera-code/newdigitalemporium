
import TestimonialForm from "@/components/admin/testimonials/TestimonialForm";
import type { Testimonial } from "@/lib/placeholder-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { db } from "@/lib/firebase/config";
import { ref, get, child } from "firebase/database";
import type { Locale } from '@/lib/i18n/i18n-config';
import { i18n } from '@/lib/i18n/i18n-config';

interface EditTestimonialPageProps {
  params: Promise<{
    id?: string;
    lang?: Locale;
  }>;
}

async function getTestimonialFromDB(id: string): Promise<Testimonial | null> {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `testimonials/${id}`));
    if (snapshot.exists()) {
      return { id: snapshot.key, ...snapshot.val() } as Testimonial;
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error fetching testimonial ${id} from Firebase DB:`, error);
    return null;
  }
}

export default async function EditTestimonialPage({ params }: EditTestimonialPageProps) {
  const resolvedParams = await params;
  const testimonialId = resolvedParams?.id;
  const lang = resolvedParams?.lang || i18n.defaultLocale;
  
  if (!testimonialId) {
    notFound();
  }

  const testimonial = await getTestimonialFromDB(testimonialId);

  if (!testimonial) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/${lang}/admin/testimonials`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Testimonials</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-primary">Edit Testimonial: {testimonial.name}</h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Testimonial Details</CardTitle>
          <CardDescription>Update the information for this testimonial.</CardDescription>
        </CardHeader>
        <CardContent>
          <TestimonialForm initialData={testimonial} formAction="update" />
        </CardContent>
      </Card>
    </div>
  );
}
