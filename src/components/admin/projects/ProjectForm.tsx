
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
import { createProjectAction, updateProjectAction } from "@/components/admin/actions";
import type { Project } from "@/lib/placeholder-data";
import { allIconNames } from "@/lib/placeholder-data";
import { ProjectFormSchema, type ProjectFormValues } from "@/lib/schemas";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import React from "react";

interface ProjectFormProps {
  initialData?: Project | null;
  formAction: "create" | "update";
}

export default function ProjectForm({ initialData, formAction }: ProjectFormProps) {
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
    image: initialData?.image || "https://placehold.co/600x400.png",
    dataAiHint: initialData?.dataAiHint || "",
    technologies: initialData?.technologies?.join(', ') || "", // Join array for textarea
    liveLink: initialData?.liveLink || "",
    repoLink: initialData?.repoLink || "",
    clientName: initialData?.clientName || "",
    category: initialData?.category || "",
    iconName: initialData?.iconName || allIconNames[0],
  }), [initialData]);


  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(ProjectFormSchema),
    defaultValues,
  });
  
  React.useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);


  async function onSubmit(values: ProjectFormValues) {
    setIsSubmitting(true);
    try {
      if (formAction === "create") {
        await createProjectAction(values);
      } else if (formAction === "update" && initialData?.id) {
        await updateProjectAction(initialData.id, values);
      }
    } catch (error: any) {
      if (typeof error.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT')) {
        throw error;
      }
      toast({
        title: `Error ${formAction === "create" ? "Creating" : "Updating"} Project`,
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
              <FormLabel>Project Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Awesome E-commerce Site" {...field} />
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
                <Textarea placeholder="A brief summary of the project..." {...field} />
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
                <Textarea placeholder="Detailed explanation of the project, challenges, solutions..." className="min-h-[120px]" {...field} />
              </FormControl>
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
              <FormDescription>URL for the project's main image.</FormDescription>
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
                <Input placeholder="e.g., modern website" {...field} />
              </FormControl>
              <FormDescription>Keywords for AI image search if using a placeholder (max 2 words).</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="technologies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Technologies Used</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., React, Next.js, Tailwind CSS, Firebase" {...field} />
              </FormControl>
              <FormDescription>Comma-separated list of technologies.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Web Development, Mobile App, AI Solution" {...field} />
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
              <FormLabel>Icon (for Admin display)</FormLabel>
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
              <FormDescription>Choose an icon that represents the project category.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="liveLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Live Project Link (Optional)</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="repoLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repository Link (Optional)</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://github.com/user/project" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="clientName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client Name (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Acme Corp" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {formAction === "create" ? "Create Project" : "Update Project"}
        </Button>
      </form>
    </Form>
  );
}

    