
import { z } from "zod";
import { allIconNames } from "@/lib/placeholder-data";

// Bilingual Text Schema
const BilingualTextSchema = z.object({
  en: z.string().min(1, "English version is required."),
  es: z.string().min(1, "Spanish version is required."),
  fr: z.string().min(1, "French version is required."),
});

// Service Schemas
export const ServiceFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  shortDescription: z.string().min(10, "Short description must be at least 10 characters."),
  description: z.string().min(20, "Description must be at least 20 characters."),
  iconName: z.enum(allIconNames as [string, ...string[]], {message: "Invalid icon selected."}),
  image: z.string().url("Must be a valid URL for the image.").or(z.literal("").default("https://placehold.co/600x400.png")),
  dataAiHint: z.string().max(50, "AI hint for image is too long (max 50 chars, 1-2 words).").optional().default(""),
  priceInfo: z.string().min(3, "Price info must be at least 3 characters."),
  slug: z.string().min(3, "Slug must be at least 3 characters.").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens."),
});
export type ServiceFormValues = z.infer<typeof ServiceFormSchema>;

// Testimonial Schemas
export const TestimonialFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  company: z.string().optional().default(""),
  quote: z.string().min(10, "Quote must be at least 10 characters."),
  avatar: z.string().url("Must be a valid URL for the avatar image.").or(z.literal("").default("https://placehold.co/100x100.png")),
  dataAiHint: z.string().max(50, "AI hint too long").optional().default(""),
});
export type TestimonialFormValues = z.infer<typeof TestimonialFormSchema>;

// Project Schemas
export const ProjectFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  shortDescription: z.string().min(10, "Short description must be at least 10 characters long."),
  description: z.string().min(20, "Full description must be at least 20 characters long."),
  // Accept a string of URLs, then transform it into an array of validated URLs.
  images: z.string()
    .min(1, "At least one image URL is required.")
    .transform((str, ctx) => {
      const urls = str.split(/[\n,]+/).map(url => url.trim()).filter(Boolean);
      try {
        const validatedUrls = z.array(z.string().url()).parse(urls);
        if (validatedUrls.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please provide at least one valid URL.",
          });
          return z.NEVER;
        }
        return validatedUrls;
      } catch (error) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "One or more URLs are invalid.",
        });
        return z.NEVER;
      }
    }),
  dataAiHint: z.string().max(50, "AI hint for image is too long (max 50 chars).").optional().default(""),
  technologies: z.string().min(1, "Please list at least one technology (comma-separated)."), 
  liveLink: z.string().url("Live link must be a valid URL.").optional().or(z.literal("")),
  repoLink: z.string().url("Repository link must be a valid URL.").optional().or(z.literal("")),
  clientName: z.string().optional().default(""),
  category: z.string().min(3, "Category must be at least 3 characters long."),
  iconName: z.enum(allIconNames as [string, ...string[]], {message: "Invalid icon selected."}),
});
export type ProjectFormValues = z.infer<typeof ProjectFormSchema>;


// Quote Request Form Schema
export const QuoteRequestFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  company: z.string().optional(),
  phoneNumber: z.string().optional().default("").refine(val => val === "" || /^\+?[1-9]\d{1,14}$/.test(val), {
    message: "Please enter a valid phone number with country code (e.g., +1234567890).",
  }),
  service: z.string().min(1, { message: "Please select a service." }),
  projectDetails: z.string().min(10, {
    message: "Project details must be at least 10 characters.",
  }),
});
export type QuoteRequestFormValues = z.infer<typeof QuoteRequestFormSchema>;

// Site Content Schemas
const AboutPageContentSchema = z.object({
  pageTitle: BilingualTextSchema,
  heading: BilingualTextSchema,
  subHeading: BilingualTextSchema,
  section1ImageURL: z.string().url().or(z.literal("")),
  section1ImageHint: z.string().max(50).optional(),
  section1Heading: BilingualTextSchema,
  section1Paragraph1: BilingualTextSchema,
  section1Paragraph2: BilingualTextSchema,
  missionHeading: BilingualTextSchema,
  missionText: BilingualTextSchema,
  visionHeading: BilingualTextSchema,
  visionText: BilingualTextSchema,
  valuesHeading: BilingualTextSchema,
  valuesList: BilingualTextSchema, // Represented as a single string with newlines
  finalSectionHeading: BilingualTextSchema,
  finalSectionText: BilingualTextSchema,
});

const ContactPageContentSchema = z.object({
  pageTitle: BilingualTextSchema,
  heading: BilingualTextSchema,
  subHeading: BilingualTextSchema,
  emailLabel: BilingualTextSchema,
  emailValue: z.string().email(),
  phoneLabel: BilingualTextSchema,
  phoneValue: z.string(),
  addressLabel: BilingualTextSchema,
  addressValue: BilingualTextSchema,
  ctaHeading: BilingualTextSchema,
  ctaDescription: BilingualTextSchema,
});

const SocialLinkSchema = z.object({
  id: z.string(), // for useFieldArray key
  name: z.string().min(1, "Social media name is required."),
  href: z.string().url("Must be a valid URL."),
  iconName: z.enum(allIconNames as [string, ...string[]], { message: "Invalid icon selected." }),
});

export const SiteContentFormSchema = z.object({
  aboutPage: AboutPageContentSchema,
  contactPage: ContactPageContentSchema,
  socialLinks: z.array(SocialLinkSchema).max(10, "Maximum of 10 social links allowed."),
});
export type SiteContentFormValues = z.infer<typeof SiteContentFormSchema>;
