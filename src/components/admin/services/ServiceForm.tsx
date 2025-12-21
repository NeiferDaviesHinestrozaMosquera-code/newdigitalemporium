
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
import { createServiceAction, updateServiceAction } from "@/components/admin/actions";
import type { Service } from "@/lib/placeholder-data";
import { allIconNames } from "@/lib/placeholder-data"; // Changed from serviceIconNames
import { ServiceFormSchema, type ServiceFormValues } from "@/lib/schemas";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import React from "react";

interface ServiceFormProps {
  initialData?: Service | null;
  formAction: "create" | "update";
}

export default function ServiceForm({ initialData, formAction }: ServiceFormProps) {
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
    title: initialData?.title || "",
    shortDescription: initialData?.shortDescription || "",
    description: initialData?.description || "",
    iconName: initialData?.iconName || allIconNames[0],
    image: initialData?.image || "https://placehold.co/600x400.png",
    dataAiHint: initialData?.dataAiHint || "",
    priceInfo: initialData?.priceInfo || "",
    slug: initialData?.slug || "",
  }), [initialData]);


  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(ServiceFormSchema),
    defaultValues,
  });
  
  React.useEffect(() => {
    // Reset form if initialData changes (e.g., navigating between edit pages)
    form.reset(defaultValues);
  }, [defaultValues, form]);


  async function onSubmit(values: ServiceFormValues) {
    setIsSubmitting(true);
    try {
      if (formAction === "create") {
        await createServiceAction(values);
      } else if (formAction === "update" && initialData?.id) {
        await updateServiceAction(initialData.id, values);
      }
    } catch (error: any) {
      if (typeof error.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT')) {
        throw error;
      }
      toast({
        title: `Error ${formAction === "create" ? "Creating" : "Updating"} Service`,
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Web Development" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shortDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A brief summary of the service..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Detailed explanation of the service..." className="min-h-[120px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="iconName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an icon" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {allIconNames.map(iconName => (
                    <SelectItem key={iconName} value={iconName}>
                      {iconName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Choose an icon that represents the service.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://placehold.co/600x400.png" {...field} />
              </FormControl>
              <FormDescription>URL for the service image. Use https://placehold.co for placeholders.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dataAiHint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image AI Hint (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., abstract tech" {...field} />
              </FormControl>
              <FormDescription>
                One or two keywords for AI image search (e.g., Unsplash) if using a placeholder URL like placehold.co. Max 2 words.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priceInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price Information</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Starts from $1,000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="e.g., web-development" {...field} />
              </FormControl>
              <FormDescription>URL-friendly identifier (e.g., lowercase-with-hyphens). Used for direct links.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {formAction === "create" ? "Create Service" : "Update Service"}
        </Button>
      </form>
    </Form>
  );
}

