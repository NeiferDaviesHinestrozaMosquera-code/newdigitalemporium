import ServiceForm from "@/components/admin/services/ServiceForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Locale } from '@/lib/i18n/i18n-config';
import { i18n } from '@/lib/i18n/i18n-config';

export default async function NewServicePage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/${lang}/admin/services`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Services</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-primary">Add New Service</h1>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
          <CardDescription>Fill in the information for the new service.</CardDescription>
        </CardHeader>
        <CardContent>
          <ServiceForm formAction="create" />
        </CardContent>
      </Card>
    </div>
  );
}