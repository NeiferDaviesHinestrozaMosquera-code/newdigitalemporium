"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Service } from "@/lib/placeholder-data"; 
import { QuoteRequestFormSchema, type QuoteRequestFormValues } from "@/lib/schemas";
import { submitQuoteRequestAction } from "@/components/admin/actions";
import { Loader2 } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n/i18n-config";

// Este componente es ahora un "Client Component"

interface QuoteRequestFormProps {
  availableServices: Service[];
  lang: Locale;
  labels: {
      submitting: string;
      sendRequest: string;
  }
}

export function QuoteRequestForm({ availableServices, lang, labels }: QuoteRequestFormProps) {
  const { toast } = useToast();
  const router = useRouter(); 
  const [isSubmittingClient, setIsSubmittingClient] = React.useState(false);
  const mountedRef = React.useRef(true);

  React.useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const form = useForm<QuoteRequestFormValues>({
    resolver: zodResolver(QuoteRequestFormSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      phoneNumber: "",
      service: "",
      projectDetails: "",
    },
  });

  async function onSubmit(values: QuoteRequestFormValues) {
    setIsSubmittingClient(true);
    try {
      const result = await submitQuoteRequestAction(values);

      if (result.success && result.newInquiryId) {
        toast({
          title: "Request Submitted!",
          description: "Redirecting you to the admin panel to view the new inquiry.",
        });
        router.push(`/${lang}/admin/inquiries?status=success&newInquiryId=${result.newInquiryId}`);
      } else {
        toast({
          title: "Submission Failed",
          description: result.error || "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error submitting quote request form:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "An unexpected network or server error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      if (mountedRef.current) {
        setIsSubmittingClient(false);
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl mx-auto">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Your Company Inc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number (Optional)</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="+1 123 456 7890" {...field} />
              </FormControl>
              <FormDescription>
                Please include your country code.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="service"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Interested In</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableServices.map(service => (
                    <SelectItem key={service.id} value={service.title}>
                      {service.title}
                    </SelectItem>
                  ))}
                  <SelectItem value="Other">Other (Please specify in details)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="projectDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Details</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your project, requirements, and goals..."
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The more details you provide, the better we can assist you.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmittingClient}>
          {isSubmittingClient ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {labels.submitting}
            </>
          ) : (
            labels.sendRequest
          )}
        </Button>
      </form>
    </Form>
  );
}
