'use server';

import { generate } from '@genkit-ai/ai';
import { generateQuotePrompt } from '@/ai/flows/generate-quote';
import { updateInquiryWithQuote } from '@/lib/db/inquiries';
import { z } from 'zod';

// Define the input schema for the action
const GenerateQuoteSchema = z.object({
  requestDetails: z.string(),
  inquiryId: z.string(),
});

export async function generateQuoteAction(input: z.infer<typeof GenerateQuoteSchema>) {
  // Validate input
  const validatedInput = GenerateQuoteSchema.parse(input);

  try {
    const llmResponse = await generate({
      prompt: generateQuotePrompt,
      input: validatedInput.requestDetails,
    });

    const generatedQuote = llmResponse.output();
    if (!generatedQuote) {
      throw new Error('Failed to generate quote from the model.');
    }

    // Update the inquiry in the database with the generated quote
    await updateInquiryWithQuote(validatedInput.inquiryId, generatedQuote);

    return generatedQuote;
  } catch (error) {
    console.error('Error generating quote action:', error);
    // Consider how to handle the error. Maybe re-throw or return a specific error structure.
    throw new Error(`An error occurred while generating the quote: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
