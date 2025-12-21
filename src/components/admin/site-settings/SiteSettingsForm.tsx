
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, Controller } from "react-hook-form";
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
import { updateSiteContentAction } from "@/components/admin/actions";
import type { SiteContent, SocialLink } from "@/lib/placeholder-data";
import { allIconNames, iconMap } from "@/lib/placeholder-data";
import { SiteContentFormSchema, type SiteContentFormValues } from "@/lib/schemas";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import React, { useEffect } from "react";
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs for new social links

interface SiteSettingsFormProps {
  initialData: SiteContent | null;
}

const locales: Array<'en' | 'es' | 'fr'> = ['en', 'es', 'fr'];

export default function SiteSettingsForm({ initialData }: SiteSettingsFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<SiteContentFormValues>({
    resolver: zodResolver(SiteContentFormSchema),
    defaultValues: initialData || undefined, // Zod default values will apply if initialData is null
  });

  const { fields: socialLinksFields, append: appendSocialLink, remove: removeSocialLink } = useFieldArray({
    control: form.control,
    name: "socialLinks",
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  async function onSubmit(values: SiteContentFormValues) {
    setIsSubmitting(true);
    try {
      const result = await updateSiteContentAction(values);
      if (result.success) {
        toast({
          title: "Site Content Updated",
          description: "Your changes have been saved successfully.",
        });
      } else {
        toast({
          title: "Error Updating Site Content",
          description: result.error || "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error Updating Site Content",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const renderBilingualField = (fieldNamePrefix: string, label: string, fieldType: "input" | "textarea" = "input") => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 border rounded-md">
      {locales.map(lang => (
        <FormField
          key={`${fieldNamePrefix}.${lang}`}
          control={form.control}
          name={`${fieldNamePrefix}.${lang}` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label} ({lang.toUpperCase()})</FormLabel>
              <FormControl>
                {fieldType === "textarea" ? (
                  <Textarea placeholder={`${label} in ${lang.toUpperCase()}`} {...field} className="min-h-[100px]" />
                ) : (
                  <Input placeholder={`${label} in ${lang.toUpperCase()}`} {...field} />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </div>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        
        {/* About Page Section */}
        <section className="space-y-6 p-4 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-primary border-b pb-2">About Us Page Content</h2>
          {renderBilingualField("aboutPage.pageTitle", "Page Title (Meta)")}
          {renderBilingualField("aboutPage.heading", "Main Heading")}
          {renderBilingualField("aboutPage.subHeading", "Sub Heading", "textarea")}
          
          <FormField
            control={form.control}
            name="aboutPage.section1ImageURL"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Section 1 Image URL</FormLabel>
                <FormControl><Input placeholder="https://placehold.co/800x600.png" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="aboutPage.section1ImageHint"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Section 1 Image AI Hint</FormLabel>
                <FormControl><Input placeholder="e.g., team collaboration" {...field} /></FormControl>
                <FormDescription>Max 2 words for AI image placeholder.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {renderBilingualField("aboutPage.section1Heading", "Section 1 Heading")}
          {renderBilingualField("aboutPage.section1Paragraph1", "Section 1 Paragraph 1", "textarea")}
          {renderBilingualField("aboutPage.section1Paragraph2", "Section 1 Paragraph 2", "textarea")}
          
          {renderBilingualField("aboutPage.missionHeading", "Mission Heading")}
          {renderBilingualField("aboutPage.missionText", "Mission Text", "textarea")}
          
          {renderBilingualField("aboutPage.visionHeading", "Vision Heading")}
          {renderBilingualField("aboutPage.visionText", "Vision Text", "textarea")}
          
          {renderBilingualField("aboutPage.valuesHeading", "Values Heading")}
          {renderBilingualField("aboutPage.valuesList", "Values List (one per line)", "textarea")}

          {renderBilingualField("aboutPage.finalSectionHeading", "Final Section Heading")}
          {renderBilingualField("aboutPage.finalSectionText", "Final Section Text", "textarea")}
        </section>

        {/* Contact Page Section */}
        <section className="space-y-6 p-4 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-primary border-b pb-2">Contact Page Content</h2>
          {renderBilingualField("contactPage.pageTitle", "Page Title (Meta)")}
          {renderBilingualField("contactPage.heading", "Main Heading")}
          {renderBilingualField("contactPage.subHeading", "Sub Heading", "textarea")}
          {renderBilingualField("contactPage.emailLabel", "Email Label")}
          <FormField
            control={form.control}
            name="contactPage.emailValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address Value</FormLabel>
                <FormControl><Input type="email" placeholder="hello@example.com" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {renderBilingualField("contactPage.phoneLabel", "Phone Label")}
          <FormField
            control={form.control}
            name="contactPage.phoneValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number Value</FormLabel>
                <FormControl><Input placeholder="+1 (555) 123-4567" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {renderBilingualField("contactPage.addressLabel", "Address Label")}
          {renderBilingualField("contactPage.addressValue", "Address Value", "textarea")}
          {renderBilingualField("contactPage.ctaHeading", "CTA Heading")}
          {renderBilingualField("contactPage.ctaDescription", "CTA Description", "textarea")}
        </section>

        {/* Social Links Section */}
        <section className="space-y-6 p-4 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-primary border-b pb-2">Social Media Links</h2>
          {socialLinksFields.map((field, index) => (
            <div key={field.id} className="flex items-end gap-4 p-3 border rounded-md">
              <FormField
                control={form.control}
                name={`socialLinks.${index}.name`}
                render={({ field: formField }) => (
                  <FormItem className="flex-grow">
                    <FormLabel>Name</FormLabel>
                    <FormControl><Input placeholder="e.g., GitHub" {...formField} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`socialLinks.${index}.href`}
                render={({ field: formField }) => (
                  <FormItem className="flex-grow">
                    <FormLabel>URL</FormLabel>
                    <FormControl><Input type="url" placeholder="https://github.com" {...formField} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`socialLinks.${index}.iconName`}
                render={({ field: formField }) => (
                  <FormItem className="flex-grow">
                    <FormLabel>Icon</FormLabel>
                    <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select icon" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {allIconNames.filter(iconName => iconMap[iconName]).map(iconName => (
                          <SelectItem key={iconName} value={iconName}>{iconName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" variant="destructive" size="icon" onClick={() => removeSocialLink(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => appendSocialLink({ id: uuidv4(), name: "", href: "", iconName: "HelpCircle" })}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add Social Link
          </Button>
        </section>

        <Button type="submit" disabled={isSubmitting} className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3 px-6">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Site Settings
        </Button>
      </form>
    </Form>
  );
}

    