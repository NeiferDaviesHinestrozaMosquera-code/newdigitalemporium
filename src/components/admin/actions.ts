'use server';

import { z } from 'zod';
import { generate } from '@genkit-ai/ai';
import { generateQuotePrompt } from '@/ai/flows/generate-quote';
import { ref, push, set, get, update, remove } from 'firebase/database';
import { db } from '@/lib/firebase/config';
import { ClientInquirySchema, ServiceSchema, TestimonialSchema, SiteContentSchema } from '@/lib/schemas';
import type { ClientInquiry, Service, Testimonial, SiteContent, ClientInquiryStatus, AiGeneratedQuote } from '@/lib/placeholder-data';
import { revalidatePath } from 'next/cache';

// Helper to revalidate paths
const revalidateAdminPaths = () => {
  revalidatePath('/[lang]/admin');
  revalidatePath('/[lang]/admin/inquiries');
  revalidatePath('/[lang]/admin/services');
  revalidatePath('/[lang]/admin/testimonials');
  revalidatePath('/[lang]/admin/site-settings');
};

// Inquiry Actions
export async function submitQuoteRequestAction(data: Omit<ClientInquiry, 'id' | 'date' | 'status'>) {
  const inquiryRef = ref(db, 'inquiries');
  const newInquiryRef = push(inquiryRef);
  await set(newInquiryRef, {
    ...data,
    date: new Date().toISOString(),
    status: 'New',
  });
  revalidatePath('/[lang]/contact');
  revalidatePath('/[lang]/quote-request');
}

export async function updateInquiryStatusAction({ inquiryId, status }: { inquiryId: string; status: ClientInquiryStatus }) {
  const inquiryRef = ref(db, `inquiries/${inquiryId}`);
  await update(inquiryRef, { status });
  revalidateAdminPaths();
}

export async function generateQuoteAction(input: { requestDetails: string, inquiryId: string }) {
  const llmResponse = await generate({
    prompt: generateQuotePrompt,
    input: input.requestDetails,
  });
  const generatedQuote = llmResponse.output() as AiGeneratedQuote;
  if (!generatedQuote) {
    throw new Error('Failed to generate quote from the model.');
  }
  const inquiryRef = ref(db, `inquiries/${input.inquiryId}`);
  await update(inquiryRef, { generatedQuote, status: 'Quoted' });
  revalidateAdminPaths();
  return generatedQuote;
}

// Service Actions
export async function createServiceAction(data: Omit<Service, 'id'>) {
  const serviceRef = ref(db, 'services');
  const newServiceRef = push(serviceRef);
  await set(newServiceRef, data);
  revalidateAdminPaths();
}

export async function updateServiceAction(data: Service) {
  const { id, ...serviceData } = data;
  const serviceRef = ref(db, `services/${id}`);
  await update(serviceRef, serviceData);
  revalidateAdminPaths();
}

export async function deleteServiceAction(id: string) {
  const serviceRef = ref(db, `services/${id}`);
  await remove(serviceRef);
  revalidateAdminPaths();
}

// Testimonial Actions
export async function createTestimonialAction(data: Omit<Testimonial, 'id'>) {
  const testimonialRef = ref(db, 'testimonials');
  const newTestimonialRef = push(testimonialRef);
  await set(newTestimonialRef, data);
  revalidateAdminPaths();
}

export async function updateTestimonialAction(data: Testimonial) {
  const { id, ...testimonialData } = data;
  const testimonialRef = ref(db, `testimonials/${id}`);
  await update(testimonialRef, testimonialData);
  revalidateAdminPaths();
}

export async function deleteTestimonialAction(id: string) {
  const testimonialRef = ref(db, `testimonials/${id}`);
  await remove(testimonialRef);
  revalidateAdminPaths();
}

// Site Content Actions
export async function getSiteContentAction(): Promise<SiteContent | null> {
  const siteContentRef = ref(db, 'siteContent');
  const snapshot = await get(siteContentRef);
  if (snapshot.exists()) {
    return snapshot.val();
  }
  return null;
}

export async function updateSiteContentAction(data: SiteContent) {
  const siteContentRef = ref(db, 'siteContent');
  await set(siteContentRef, data);
  revalidatePath('/', 'layout'); // Revalidate all pages using the layout
}
