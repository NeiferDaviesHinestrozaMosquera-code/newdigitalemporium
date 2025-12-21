"use server";

import { generateQuote, type GenerateQuoteInput, type GenerateQuoteOutput } from "@/ai/flows/generate-quote";
import type { ClientInquiryStatus, ClientInquiry, Service, Testimonial, SiteContent } from "@/lib/placeholder-data";
import { defaultSiteContent } from "@/lib/placeholder-data";
import type { ServiceFormValues, TestimonialFormValues, QuoteRequestFormValues, SiteContentFormValues } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/firebase/config";
import { ref, set, get, child, update, remove, push } from "firebase/database";

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

// Testimonial Actions
export async function createTestimonialAction(values: TestimonialFormValues) {
  try {
    const newTestimonialRef = push(ref(db, 'testimonials'));
    const newTestimonialId = newTestimonialRef.key;
    if (!newTestimonialId) throw new Error("Failed to generate testimonial ID.");

    const newTestimonial: Omit<Testimonial, 'id'> = {
      ...values,
      avatar: values.avatar || "https://placehold.co/100x100.png",
    };
    await set(ref(db, `testimonials/${newTestimonialId}`), newTestimonial);

    revalidatePath("/admin/testimonials");
    revalidatePath("/[lang]/admin/testimonials", "layout");
    revalidatePath("/");
    revalidatePath("/[lang]/", "layout");
  } catch (error: any) {
    console.error("Error creating testimonial:", error);
    if (typeof error.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT')) throw error;
    throw new Error(error.message || "Failed to create testimonial.");
  }
  redirect("/admin/testimonials");
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
  } catch (error: any) {
    console.error(`Error updating testimonial ${id}:`, error);
    if (typeof error.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT')) throw error;
    throw new Error(error.message || `Failed to update testimonial.`);
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
  } catch (error) {
     console.error(`Error deleting testimonial ${id}:`, error);
    throw new Error(error instanceof Error ? error.message : `Failed to delete testimonial.`);
  }
}

// Inquiry Actions
export async function updateInquiryStatusAction(id: string, status: ClientInquiryStatus) {
  try {
    await update(ref(db, `inquiries/${id}`), { status: status });
    revalidatePath("/admin/inquiries");
    revalidatePath("/[lang]/admin/inquiries", "layout");
  } catch (error) {
    console.error(`Error updating inquiry status for ${id}:`, error);
     throw new Error(error instanceof Error ? error.message : `Failed to update inquiry.`);
  }
}

export async function submitQuoteRequestAction(data: QuoteRequestFormValues): Promise<{ success: boolean; error?: string; newInquiryId?: string }> {
  try {
    const newInquiryRef = push(ref(db, 'inquiries'));
    const newInquiryId = newInquiryRef.key;
    if (!newInquiryId) throw new Error("Failed to generate inquiry ID.");

    const newInquiryData: Omit<ClientInquiry, 'id' | 'generatedQuote'> = { 
      name: data.name,
      email: data.email,
      company: data.company || "",
      phoneNumber: data.phoneNumber || "",
      serviceRequested: data.service,
      details: data.projectDetails,
      date: new Date().toISOString(),
      status: 'New',
    };
    
    await set(ref(db, `inquiries/${newInquiryId}`), newInquiryData);

    revalidatePath("/admin/inquiries");
    revalidatePath("/[lang]/admin/inquiries", "layout");
    
    return { success: true, newInquiryId: newInquiryId };
  } catch (e) {
    console.error("Error submitting quote request:", e);
    const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
    return { success: false, error: `Failed to submit quote request: ${errorMessage}` };
  }
}

// Service Actions
export async function createServiceAction(values: ServiceFormValues) {
  try {
    const newServiceRef = push(ref(db, 'services'));
    const newServiceId = newServiceRef.key;
    if (!newServiceId) throw new Error("Failed to generate service ID.");

    const newService: Omit<Service, 'id'> = {
      ...values,
      image: values.image || "https://placehold.co/400x300.png",
    };
    await set(ref(db, `services/${newServiceId}`), newService);

    revalidatePath("/admin/services");
    revalidatePath("/[lang]/admin/services", "layout");
    revalidatePath("/services");
    revalidatePath("/[lang]/services", "layout");
  } catch (error: any) {
    console.error("Error creating service:", error);
    if (typeof error.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT')) throw error;
    throw new Error(error.message || "Failed to create service.");
  }
  redirect("/admin/services");
}

export async function updateServiceAction(id: string, values: ServiceFormValues) {
  try {
    const serviceToUpdate: Omit<Service, 'id'> = {
      ...values,
      image: values.image || "https://placehold.co/400x300.png",
    };
    await set(ref(db, `services/${id}`), serviceToUpdate);

    revalidatePath("/admin/services");
    revalidatePath("/[lang]/admin/services", "layout");
    revalidatePath(`/admin/services/edit/${id}`);
    revalidatePath(`/[lang]/admin/services/edit/${id}`, "layout");
    revalidatePath("/services");
    revalidatePath("/[lang]/services", "layout");
  } catch (error: any) {
    console.error(`Error updating service ${id}:`, error);
    if (typeof error.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT')) throw error;
    throw new Error(error.message || `Failed to update service.`);
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
  } catch (error) {
    console.error(`Error deleting service ${id}:`, error);
    throw new Error(error instanceof Error ? error.message : `Failed to delete service.`);
  }
}

// Site Content Actions
export async function getSiteContentAction(): Promise<SiteContent> {
  try {
    const snapshot = await get(child(ref(db), `siteContent/default`));
    if (snapshot.exists()) {
      return snapshot.val() as SiteContent;
    }
    console.warn("Firebase: No site content found, returning local default.");
    return defaultSiteContent;
  } catch (error) {
    console.error("CRITICAL: Firebase read error for site content.", error);
    console.warn("Firebase: Returning local default content due to read error.");
    return defaultSiteContent; 
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
    revalidatePath("/");
    revalidatePath("/[lang]/", "layout");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating site content:", error);
    return { success: false, error: error.message || "Failed to update site content." };
  }
}
