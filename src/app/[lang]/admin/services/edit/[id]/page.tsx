import ServiceForm from "@/components/admin/services/ServiceForm";
import type { Service } from "@/lib/placeholder-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { db } from "@/lib/firebase/config";
import { ref, get, child } from "firebase/database";
import type { Locale } from '@/lib/i18n/i18n-config';
import { i18n } from '@/lib/i18n/i18n-config';

interface EditServicePageProps {
  params: Promise<{
    id?: string;
    lang?: Locale;
  }>;
}

async function getServiceFromDB(id: string): Promise<Service | null> {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `services/${id}`));
    if (snapshot.exists()) {
      return { id: snapshot.key, ...snapshot.val() } as Service;
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error fetching service ${id} from Firebase DB:`, error);
    return null;
  }
}

export default async function EditServicePage({ params }: EditServicePageProps) {
  // Await the params Promise before accessing its properties
  const resolvedParams = await params;
  const serviceId = resolvedParams?.id;
  const lang = resolvedParams?.lang || i18n.defaultLocale;

  if (!serviceId) {
    notFound();
  }

  const service = await getServiceFromDB(serviceId);

  if (!service) {
    notFound();
  }

  return (
    <div className="space-y-6">
       <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/${lang}/admin/services`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Services</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-primary">Edit Service: {service.title}</h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
          <CardDescription>Update the information for this service.</CardDescription>
        </CardHeader>
        <CardContent>
          <ServiceForm initialData={service} formAction="update" />
        </CardContent>
      </Card>
    </div>
  );
}