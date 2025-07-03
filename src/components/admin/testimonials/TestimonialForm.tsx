
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
import { useToast } from "@/hooks/use-toast";
import { createTestimonialAction, updateTestimonialAction } from "@/components/admin/actions";
import type { Testimonial } from "@/lib/placeholder-data";
import { TestimonialFormSchema, type TestimonialFormValues } from "@/lib/schemas";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import React from "react";

interface TestimonialFormProps {
  initialData?: Testimonial | null;
  formAction: "create" | "update";
}

export default function TestimonialForm({ initialData, formAction }: TestimonialFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const mountedRef = React.useRef(true);

  React.useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const defaultValues = React.useMemo(() => ({
    name: initialData?.name || "",
    company: initialData?.company || "",
    quote: initialData?.quote || "",
    avatar: initialData?.avatar || "https://placehold.co/100x100.png",
    dataAiHint: initialData?.dataAiHint || "",
  }), [initialData]);
  
  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(TestimonialFormSchema),
    defaultValues,
  });

  React.useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  async function onSubmit(values: TestimonialFormValues) {
    setIsSubmitting(true);
    try {
      if (formAction === "create") {
        await createTestimonialAction(values);
        // Success toast removed, redirect handles feedback
      } else if (formAction === "update" && initialData?.id) {
        await updateTestimonialAction(initialData.id, values);
        // Success toast removed, redirect handles feedback
      }
      // router.refresh(); // Replaced by redirect in server action
    } catch (error: any) {
       if (typeof error.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT')) {
        // This is a redirect error, re-throw it so Next.js can handle it.
        throw error;
      }
      // This is a "real" error from the server action (not a redirect).
      toast({
        title: "Error Submitting Testimonial",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      if (mountedRef.current) {
        setIsSubmitting(false);
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
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
                <Input placeholder="Tech Solutions Inc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quote"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quote</FormLabel>
              <FormControl>
                <Textarea placeholder="Their service was outstanding..." className="min-h-[100px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://placehold.co/100x100.png" {...field} />
              </FormControl>
              <FormDescription>URL for the client's avatar. Use https://placehold.co for placeholders.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dataAiHint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar AI Hint (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., smiling person" {...field} />
              </FormControl>
              <FormDescription>Keywords for AI to find a suitable image if using a placeholder service (max 2 words).</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {formAction === "create" ? "Create Testimonial" : "Update Testimonial"}
        </Button>
      </form>
    </Form>
  );
}
