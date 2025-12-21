import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { iconMap, type Service } from "@/lib/placeholder-data";
import Image from 'next/image';
import Link from "next/link";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { deleteServiceAction } from "@/components/admin/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { db } from "@/lib/firebase/config";
import { ref, get, child } from "firebase/database";
import type { Locale } from '@/lib/i18n/i18n-config';
import { i18n } from '@/lib/i18n/i18n-config';

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
    console.error("Error fetching services from Firebase DB:", error);
    return []; 
  }
}

export default async function AdminServicesPage({ params }: { params?: Promise<{ lang?: Locale }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || i18n.defaultLocale;
  const services = await getServicesFromDB();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Manage Services</h1>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href={`/${lang}/admin/services/new`}>
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Service
          </Link>
        </Button>
      </div>

      {services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const IconComponent = iconMap[service.iconName] || iconMap['HelpCircle'];
            return (
              <Card key={service.id} className="shadow-md flex flex-col">
                <CardHeader>
                  {service.image && (
                    <div className="relative w-full h-40 mb-3 rounded-t-md overflow-hidden">
                      <Image src={service.image} alt={service.title} fill={true} style={{objectFit: 'cover'}} data-ai-hint={service.dataAiHint || 'abstract image'}/>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <IconComponent className="w-7 h-7 text-primary" />
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                  </div>
                  <CardDescription className="text-xs pt-1">{service.shortDescription}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-xs text-muted-foreground line-clamp-3">{service.description}</p>
                   <p className="text-xs font-semibold text-accent mt-2">{service.priceInfo}</p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 border-t pt-4 mt-auto">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/${lang}/admin/services/edit/${service.id}`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the service from Firebase.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <form action={async () => {
                          "use server";
                          if (!service.id) return; 
                          await deleteServiceAction(service.id);
                        }}>
                          <AlertDialogAction type="submit">Delete</AlertDialogAction>
                        </form>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            );
          })}
        </div>
        ) : (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No services found. Add your first service!
          </CardContent>
        </Card>
      )}
    </div>
  );
}