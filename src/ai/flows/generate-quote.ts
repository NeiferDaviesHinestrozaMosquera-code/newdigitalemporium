'use server';

/**
 * @fileOverview AI-Powered Quote Generator.
 *
 * - generateQuote - A function that handles the quote generation process.
 * - GenerateQuoteInput - The input type for the generateQuote function.
 * - GenerateQuoteOutput - The return type for the generateQuote function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuoteInputSchema = z.object({
  requestDetails: z
    .string()
    .describe('Detailed description of the client request for digital services, including the type of service, specific requirements, and any relevant background information. This request is in the primary language of the client (e.g., Spanish or English).'),
});
export type GenerateQuoteInput = z.infer<typeof GenerateQuoteInputSchema>;

const BilingualContentSchema = z.object({
  en: z.string().describe('The content in English.'),
  es: z.string().describe('El contenido en Español.'),
});

const GenerateQuoteOutputSchema = z.object({
  projectScope: BilingualContentSchema.describe('A detailed project scope outlining the deliverables, milestones, and timelines, provided in both English and Spanish.'),
  costEstimate: BilingualContentSchema.describe('An estimated cost range for the project, considering the scope and complexity, provided in both English and Spanish.'),
  additionalNotes: BilingualContentSchema.describe('Any additional notes or considerations for the quote, such as potential risks or assumptions, provided in both English and Spanish.'),
});
export type GenerateQuoteOutput = z.infer<typeof GenerateQuoteOutputSchema>;

export async function generateQuote(input: GenerateQuoteInput): Promise<GenerateQuoteOutput> {
  return generateQuoteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuotePrompt',
  input: {schema: GenerateQuoteInputSchema},
  output: {schema: GenerateQuoteOutputSchema},
  prompt: `You are an AI-powered quote generator for digital services. Analyze the client's request and provide a detailed project scope, cost estimate, and any additional notes.

Client Request Details (this is the primary language, please use it as a reference for your response, but generate all outputs in both English and Spanish):
{{{requestDetails}}}

Based on the request details, generate the following, ensuring EACH field (projectScope, costEstimate, additionalNotes) has distinct content for 'en' (English) and 'es' (Spanish):

For projectScope:
  en: [English project scope here]
  es: [Alcance del proyecto en Español aquí]

For costEstimate:
  en: [English cost estimate here]
  es: [Estimación de costos en Español aquí]

For additionalNotes:
  en: [English additional notes here]
  es: [Notas adicionales en Español aquí]
`,
});

const generateQuoteFlow = ai.defineFlow(
  {
    name: 'generateQuoteFlow',
    inputSchema: GenerateQuoteInputSchema,
    outputSchema: GenerateQuoteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("AI failed to generate a quote.");
    }
    // Ensure all bilingual fields are present
    if (!output.projectScope?.en || !output.projectScope?.es ||
        !output.costEstimate?.en || !output.costEstimate?.es ||
        !output.additionalNotes?.en || !output.additionalNotes?.es) {
      console.error("AI response missing bilingual fields:", output);
      throw new Error("AI response is incomplete. Missing bilingual fields for the quote.");
    }
    return output;
  }
);
