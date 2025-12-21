
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Testimonial } from "@/lib/placeholder-data";
import Link from "next/link";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { deleteTestimonialAction } from "@/components/admin/actions";
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

async function getTestimonialsFromDB(): Promise<Testimonial[]> {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `testimonials`));
    if (snapshot.exists()) {
      const testimonialsObject = snapshot.val();
      const testimonialsArray = Object.keys(testimonialsObject)
        .map(key => ({ id: key, ...testimonialsObject[key] }))
         .sort((a, b) => a.name.localeCompare(b.name)); 
      return testimonialsArray as Testimonial[];
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching testimonials from Firebase DB:", error);
    return [];
  }
}

export default async function AdminTestimonialsPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const testimonials = await getTestimonialsFromDB();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Manage Testimonials</h1>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href={`/${lang}/admin/testimonials/new`}>
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Testimonial
          </Link>
        </Button>
      </div>

      {testimonials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial) => {
            const fallbackInitials = testimonial.name.split(' ').map(n => n[0]).join('').toUpperCase();
            return(
              <Card key={testimonial.id} className="shadow-md">
                <CardHeader className="flex flex-row items-start gap-4">
                  <Avatar className="h-12 w-12">
                    {testimonial.avatar && <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint={testimonial.dataAiHint || 'person image'} />}
                    <AvatarFallback>{fallbackInitials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                    {testimonial.company && <CardDescription className="text-xs">{testimonial.company}</CardDescription>}
                  </div>
                </CardHeader>
                <CardContent>
                  <blockquote className="italic text-sm text-muted-foreground">"{testimonial.quote}"</blockquote>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 border-t pt-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/${lang}/admin/testimonials/edit/${testimonial.id}`}>
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
                          This action cannot be undone. This will permanently delete the testimonial from Firebase.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <form action={async () => {
                          "use server";
                          if (!testimonial.id) return;
                          await deleteTestimonialAction(testimonial.id);
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
            No testimonials found. Add your first testimonial!
          </CardContent>
        </Card>
      )}
    </div>
  );
}
