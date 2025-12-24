import { db } from '@/lib/firebase/config';
import { ref, update } from 'firebase/database';

export async function updateInquiryWithQuote(inquiryId: string, quote: any): Promise<void> {
  try {
    const inquiryRef = ref(db, `inquiries/${inquiryId}`);
    await update(inquiryRef, { generatedQuote: quote, status: 'Quoted' });
  } catch (error) {
    console.error('Error updating inquiry with quote:', error);
    throw new Error('Failed to update inquiry in the database.');
  }
}
