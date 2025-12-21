
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
import { createProjectAction, updateProjectAction } from "@/components/admin/project-action";
import type { Project } from "@/lib/placeholder-data";
import { allIconNames } from "@/lib/placeholder-data";
import { ProjectFormSchema, type ProjectFormValues } from "@/lib/schemas";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import React from "react";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

interface ProjectFormProps {
  initialData?: Project | null;
  formAction: "create" | "update";
  dictionary: Dictionary;
}

export default function ProjectForm({ initialData, formAction, dictionary }: ProjectFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const defaultValues = React.useMemo(() => ({
    title: initialData?.title || "",
    shortDescription: initialData?.shortDescription || "",
    description: initialData?.description || "",
    images: Array.isArray(initialData?.images) ? initialData.images.join('\n') : "",
    dataAiHint: initialData?.dataAiHint || "",
    technologies: Array.isArray(initialData?.technologies) ? initialData.technologies.join(', ') : "",
    liveLink: initialData?.liveLink || "",
    repoLink: initialData?.repoLink || "",
    clientName: initialData?.clientName || "",
    category: initialData?.category || "",
    iconName: initialData?.iconName || allIconNames[0],
  }), [initialData]);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(ProjectFormSchema),
    defaultValues,
    mode: "onChange", 
  });

  React.useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  async function onSubmit(values: ProjectFormValues) {
    setIsSubmitting(true);
    try {
      let actionPromise;
      if (formAction === "create") {
        actionPromise = createProjectAction(values);
        toast({
          title: dictionary.projectCreatedSuccessTitle,
          description: dictionary.projectCreatedSuccessDescription,
        });
      } else if (formAction === "update" && initialData?.id) {
        actionPromise = updateProjectAction(initialData.id, values);
        toast({
          title: dictionary.projectUpdatedSuccessTitle,
          description: dictionary.projectUpdatedSuccessDescription,
        });
      } else {
        throw new Error("Invalid form action or missing project ID.");
      }
      await actionPromise;
      // No redirect here, handled by server action
    } catch (error: any) {
      console.error("Form submission error:", error);
      // Server actions that redirect throw a special error, don't show a toast for it.
      if (error.digest?.startsWith('NEXT_REDIRECT')) {
        throw error;
      }
      toast({
        title: formAction === 'create' ? dictionary.projectCreationErrorTitle : dictionary.projectUpdateErrorTitle,
        description: error.message || dictionary.unexpectedError,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
              <FormLabel>{dictionary.projectFormLabelTitle}</FormLabel>
              <FormControl>
                <Input placeholder={dictionary.projectFormPlaceholderTitle} {...field} />
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
              <FormLabel>{dictionary.projectFormLabelShortDescription}</FormLabel>
              <FormControl>
                <Textarea placeholder={dictionary.projectFormPlaceholderShortDescription} {...field} />
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
              <FormLabel>{dictionary.projectFormLabelDescription}</FormLabel>
              <FormControl>
                <Textarea placeholder={dictionary.projectFormPlaceholderDescription} className="min-h-[120px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary.projectFormLabelImageURLs}</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={dictionary.projectFormPlaceholderImageURLs}
                  className="min-h-[120px]"
                  {...field} 
                />
              </FormControl>
              <FormDescription>{dictionary.projectFormDescriptionImageURLs}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dataAiHint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary.projectFormLabelImageAIHint}</FormLabel>
              <FormControl>
                <Input placeholder={dictionary.projectFormPlaceholderImageAIHint} {...field} />
              </FormControl>
              <FormDescription>{dictionary.projectFormDescriptionImageAIHint}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="technologies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary.projectFormLabelTechnologies}</FormLabel>
              <FormControl>
                <Textarea placeholder={dictionary.projectFormPlaceholderTechnologies} {...field} />
              </FormControl>
              <FormDescription>{dictionary.projectFormDescriptionTechnologies}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary.projectFormLabelCategory}</FormLabel>
              <FormControl>
                <Input placeholder={dictionary.projectFormPlaceholderCategory} {...field} />
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
              <FormLabel>{dictionary.projectFormLabelIcon}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={dictionary.projectFormPlaceholderIcon} />
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
              <FormDescription>{dictionary.projectFormDescriptionIcon}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="liveLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary.projectFormLabelLiveLink}</FormLabel>
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
              <FormLabel>{dictionary.projectFormLabelRepoLink}</FormLabel>
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
              <FormLabel>{dictionary.projectFormLabelClientName}</FormLabel>
              <FormControl>
                <Input placeholder={dictionary.projectFormPlaceholderClientName} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {formAction === "create" ? dictionary.createProjectButton : dictionary.updateProjectButton}
        </Button>
      </form>
    </Form>
  );
}
