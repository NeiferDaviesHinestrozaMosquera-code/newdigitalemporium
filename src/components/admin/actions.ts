
"use server";

import { generateQuote, type GenerateQuoteInput, type GenerateQuoteOutput } from "@/ai/flows/generate-quote";
import type { ClientInquiryStatus, ClientInquiry, Service, Testimonial, Project, SiteContent } from "@/lib/placeholder-data";
import { defaultSiteContent } from "@/lib/placeholder-data"; // Import default
import type { ServiceFormValues, TestimonialFormValues, QuoteRequestFormValues, ProjectFormValues, SiteContentFormValues } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/firebase/config";
import { ref, set, get, child, update, remove, push, serverTimestamp } from "firebase/database";
import { v4 as uuidv4 } from 'uuid';

interface GenerateQuoteActionInputForServer extends GenerateQuoteInput {
  inquiryId: string;
}

// AI Quote Generation
export async function generateQuoteAction(input: GenerateQuoteActionInputForServer): Promise<GenerateQuoteOutput> {
  try {
    const result = await generateQuote({ requestDetails: input.requestDetails });
    
    const inquiryRef = ref(db, `inquiries/${input.inquiryId}`);
    await update(inquiryRef, {
      generatedQuote: result,
      status: 'Quoted' 
    });
    
    revalidatePath("/admin/inquiries");
    revalidatePath("/[lang]/admin/inquiries", "layout");
    revalidatePath("/admin"); 
    revalidatePath("/[lang]/admin", "layout"); 
    return result;
  } catch (error) {
    console.error("Error in generateQuoteAction with Firebase:", error);
    if (error instanceof Error) {
        throw new Error(`AI Quote Generation Failed: ${error.message}`);
    }
    throw new Error("An unexpected error occurred during AI quote generation.");
  }
}

// Service Actions
export async function createServiceAction(values: ServiceFormValues) {
  let newServiceId: string | null = null;
  try {
    const newServiceRef = push(ref(db, 'services'));
    newServiceId = newServiceRef.key;
    if (!newServiceId) throw new Error("Failed to generate service ID from Firebase.");

    const newService: Omit<Service, 'id'> = { 
      ...values,
      image: values.image || "https://placehold.co/600x400.png",
    };
    await set(ref(db, `services/${newServiceId}`), newService);
    
    revalidatePath("/admin/services");
    revalidatePath("/[lang]/admin/services", "layout");
    revalidatePath("/services"); 
    revalidatePath("/[lang]/services", "layout");
    revalidatePath("/"); 
    revalidatePath("/[lang]/", "layout");
    revalidatePath("/admin");
    revalidatePath("/[lang]/admin", "layout"); 
  } catch (error: any) {
    console.error("Error creating service in Firebase:", error);
    if (typeof error.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT')) throw error;
    throw new Error(error.message || "Failed to create service in Firebase.");
  }
  if (newServiceId) { // Only redirect if creation was potentially successful before revalidation steps
    redirect("/admin/services");
  }
}

export async function updateServiceAction(id: string, values: ServiceFormValues) {
  try {
    const serviceToUpdate: Omit<Service, 'id'> = {
      ...values,
      image: values.image || "https://placehold.co/600x400.png",
    };
    await set(ref(db, `services/${id}`), serviceToUpdate);

    revalidatePath("/admin/services");
    revalidatePath("/[lang]/admin/services", "layout");
    revalidatePath(`/admin/services/edit/${id}`);
    revalidatePath(`/[lang]/admin/services/edit/${id}`, "layout");
    revalidatePath("/services");
    revalidatePath("/[lang]/services", "layout");
    revalidatePath("/"); 
    revalidatePath("/[lang]/", "layout");
    revalidatePath("/admin");
    revalidatePath("/[lang]/admin", "layout");
  } catch (error: any) {
    console.error(`Error updating service ${id} in Firebase:`, error);
    if (typeof error.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT')) throw error;
    throw new Error(error.message || `Failed to update service ${id} in Firebase.`);
  }
  redirect("/admin/services");
}

export async function deleteServiceAction(id: string) {
  try {
    await remove(ref(db, `services/${id}`));
    
    revalidatePath("/admin/services");
    revalidatePath("/[lang]/admin/services", "layout");
    revalidatePath("/services");
    revalidatePath("/[lang]/services", "layout");
    revalidatePath("/");
    revalidatePath("/[lang]/", "layout");
    revalidatePath("/admin");
    revalidatePath("/[lang]/admin", "layout");
  } catch (error) {
    console.error(`Error deleting service ${id} from Firebase:`, error);
    throw new Error(error instanceof Error ? error.message : `Failed to delete service ${id} from Firebase.`);
  }
}

// Testimonial Actions
export async function createTestimonialAction(values: TestimonialFormValues) {
  let newTestimonialId: string | null = null;
  try {
    const newTestimonialRef = push(ref(db, 'testimonials'));
    newTestimonialId = newTestimonialRef.key;
    if (!newTestimonialId) throw new Error("Failed to generate testimonial ID from Firebase.");

    const newTestimonial: Omit<Testimonial, 'id'> = {
      ...values,
      avatar: values.avatar || "https://placehold.co/100x100.png",
    };
    await set(ref(db, `testimonials/${newTestimonialId}`), newTestimonial);

    revalidatePath("/admin/testimonials");
    revalidatePath("/[lang]/admin/testimonials", "layout");
    revalidatePath("/"); 
    revalidatePath("/[lang]/", "layout");
    revalidatePath("/admin");
    revalidatePath("/[lang]/admin", "layout");
  } catch (error: any) {
    console.error("Error creating testimonial in Firebase:", error);
    if (typeof error.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT')) throw error;
    throw new Error(error.message || "Failed to create testimonial in Firebase.");
  }
  if (newTestimonialId) {
    redirect("/admin/testimonials");
  }
}

export async function updateTestimonialAction(id: string, values: TestimonialFormValues) {
  try {
    const testimonialToUpdate: Omit<Testimonial, 'id'> = {
        ...values,
        avatar: values.avatar || "https://placehold.co/100x100.png",
    };
    await set(ref(db, `testimonials/${id}`), testimonialToUpdate);

    revalidatePath("/admin/testimonials");
    revalidatePath("/[lang]/admin/testimonials", "layout");
    revalidatePath(`/admin/testimonials/edit/${id}`);
    revalidatePath(`/[lang]/admin/testimonials/edit/${id}`, "layout");
    revalidatePath("/"); 
    revalidatePath("/[lang]/", "layout");
    revalidatePath("/admin");
    revalidatePath("/[lang]/admin", "layout");
  } catch (error: any) {
    console.error(`Error updating testimonial ${id} in Firebase:`, error);
    if (typeof error.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT')) throw error;
    throw new Error(error.message || `Failed to update testimonial ${id} in Firebase.`);
  }
  redirect("/admin/testimonials");
}

export async function deleteTestimonialAction(id: string) {
  try {
    await remove(ref(db, `testimonials/${id}`));
    
    revalidatePath("/admin/testimonials");
    revalidatePath("/[lang]/admin/testimonials", "layout");
    revalidatePath("/"); 
    revalidatePath("/[lang]/", "layout");
    revalidatePath("/admin");
    revalidatePath("/[lang]/admin", "layout");
  } catch (error) {
     console.error(`Error deleting testimonial ${id} from Firebase:`, error);
    throw new Error(error instanceof Error ? error.message : `Failed to delete testimonial ${id} from Firebase.`);
  }
}

// Project Actions
export async function createProjectAction(values: ProjectFormValues) {
  let newProjectId: string | null = null;
  try {
    const newProjectRef = push(ref(db, 'projects'));
    newProjectId = newProjectRef.key;
    if (!newProjectId) throw new Error("Failed to generate project ID from Firebase.");
    
    const newProject: Omit<Project, 'id'> = {
      ...values,
      technologies: values.technologies.split(',').map(tech => tech.trim()).filter(tech => tech.length > 0),
      image: values.image || "https://placehold.co/600x400.png",
    };
    await set(ref(db, `projects/${newProjectId}`), newProject);
    
    revalidatePath("/admin/projects");
    revalidatePath("/[lang]/admin/projects", "layout");
    revalidatePath("/projects");
    revalidatePath("/[lang]/projects", "layout");
    revalidatePath("/admin"); 
    revalidatePath("/[lang]/admin", "layout");
  } catch (error: any) {
    console.error("Error creating project in Firebase:", error);
    if (typeof error.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT')) throw error;
    throw new Error(error.message || "Failed to create project in Firebase.");
  }
  if (newProjectId) {
    redirect("/admin/projects");
  }
}

export async function updateProjectAction(id: string, values: ProjectFormValues) {
  try {
    const projectToUpdate: Omit<Project, 'id'> = {
      ...values,
      technologies: values.technologies.split(',').map(tech => tech.trim()).filter(tech => tech.length > 0),
      image: values.image || "https://placehold.co/600x400.png",
    };
    await set(ref(db, `projects/${id}`), projectToUpdate);

    revalidatePath("/admin/projects");
    revalidatePath("/[lang]/admin/projects", "layout");
    revalidatePath(`/admin/projects/edit/${id}`);
    revalidatePath(`/[lang]/admin/projects/edit/${id}`, "layout");
    revalidatePath("/projects");
    revalidatePath("/[lang]/projects", "layout");
    revalidatePath("/admin");
    revalidatePath("/[lang]/admin", "layout");
  } catch (error: any) {
    console.error(`Error updating project ${id} in Firebase:`, error);
    if (typeof error.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT')) throw error;
    throw new Error(error.message || `Failed to update project ${id} in Firebase.`);
  }
  redirect("/admin/projects");
}

export async function deleteProjectAction(id: string) {
  try {
    await remove(ref(db, `projects/${id}`));
    
    revalidatePath("/admin/projects");
    revalidatePath("/[lang]/admin/projects", "layout");
    revalidatePath("/projects");
    revalidatePath("/[lang]/projects", "layout");
    revalidatePath("/admin");
    revalidatePath("/[lang]/admin", "layout");
  } catch (error) {
    console.error(`Error deleting project ${id} from Firebase:`, error);
    throw new Error(error instanceof Error ? error.message : `Failed to delete project ${id} from Firebase.`);
  }
}

// Inquiry Actions
export async function updateInquiryStatusAction(id: string, status: ClientInquiryStatus) {
  try {
    await update(ref(db, `inquiries/${id}`), { status: status });
    revalidatePath("/admin/inquiries");
    revalidatePath("/[lang]/admin/inquiries", "layout");
    revalidatePath("/admin");
    revalidatePath("/[lang]/admin", "layout"); 
  } catch (error) {
    console.error(`Error updating inquiry status for ${id} in Firebase:`, error);
     throw new Error(error instanceof Error ? error.message : `Failed to update inquiry ${id} in Firebase.`);
  }
}

export async function submitQuoteRequestAction(data: QuoteRequestFormValues): Promise<{ success: boolean; error?: string; newInquiryId?: string }> {
  try {
    const newInquiryRef = push(ref(db, 'inquiries'));
    const newInquiryId = newInquiryRef.key;
    if (!newInquiryId) throw new Error("Failed to generate inquiry ID from Firebase.");

    const newInquiryData: Omit<ClientInquiry, 'id' | 'generatedQuote'> = { // Ensure generatedQuote is not part of initial creation if not available
      name: data.name,
      email: data.email,
      company: data.company || "",
      phoneNumber: data.phoneNumber || "",
      serviceRequested: data.service,
      details: data.projectDetails,
      date: new Date().toISOString(), // Using client's date, consider serverTimestamp() for Firebase's time
      status: 'New',
    };
    
    await set(ref(db, `inquiries/${newInquiryId}`), newInquiryData);

    revalidatePath("/admin/inquiries"); 
    revalidatePath("/[lang]/admin/inquiries", "layout"); 
    revalidatePath("/admin"); 
    revalidatePath("/[lang]/admin", "layout"); 
    
    return { success: true, newInquiryId: newInquiryId };
  } catch (e) {
    console.error("Error in submitQuoteRequestAction with Firebase:", e);
    const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
    return { success: false, error: `Failed to submit quote request: ${errorMessage}` };
  }
}


// Site Content Actions
export async function getSiteContentAction(): Promise<SiteContent> {
  try {
    const snapshot = await get(child(ref(db), `siteContent/default`));
    if (snapshot.exists()) {
      return snapshot.val() as SiteContent;
    }
    console.warn("Firebase: No site content found at '/siteContent/default'. Returning local default content. Please check Firebase Realtime Database rules and if data exists at this path.");
    return defaultSiteContent;
  } catch (error) {
    console.error("CRITICAL: Firebase Realtime Database read error for '/siteContent/default'.", error);
    console.warn("Firebase: PERMISSION DENIED or other error while fetching site content. Check your Firebase Realtime Database rules for the '/siteContent/default' path to ensure reads are allowed (e.g., '.read': true or '.read': 'auth != null'). Returning local default content to allow page rendering.");
    return defaultSiteContent; // Return default content on error to prevent page crash
  }
}

export async function updateSiteContentAction(values: SiteContentFormValues): Promise<{success: boolean, error?: string}> {
  try {
    await set(ref(db, `siteContent/default`), values);
    revalidatePath("/admin/site-settings");
    revalidatePath("/[lang]/admin/site-settings", "layout");
    revalidatePath("/about");
    revalidatePath("/[lang]/about", "layout");
    revalidatePath("/contact");
    revalidatePath("/[lang]/contact", "layout");
    revalidatePath("/"); // Footer social links
    revalidatePath("/[lang]/", "layout"); // Footer social links
    return { success: true };
  } catch (error: any) {
    console.error("Error updating site content in Firebase:", error);
    return { success: false, error: error.message || "Failed to update site content." };
  }
}
