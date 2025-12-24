
import { prompt } from '@genkit-ai/ai';

export const generateQuotePrompt = prompt({
  name: 'generateQuote',
  input: {
    schema: { type: 'string' },
  },
  output: {
    format: 'json',
    schema: {
      properties: {
        projectScope: {
          properties: {
            en: { type: 'string' },
            es: { type: 'string' },
            fr: { type: 'string' },
          },
          required: ['en', 'es', 'fr'],
          type: 'object',
        },
        costEstimate: {
          properties: {
            en: { type: 'string' },
            es: { type: 'string' },
            fr: { type: 'string' },
          },
          required: ['en', 'es', 'fr'],
          type: 'object',
        },
        additionalNotes: {
          properties: {
            en: { type: 'string' },
            es: { type: 'string' },
            fr: { type: 'string' },
          },
          required: ['en', 'es', 'fr'],
          type: 'object',
        },
      },
      required: ['projectScope', 'costEstimate', 'additionalNotes'],
      type: 'object',
    },
  },
  template: `Eres un experto en desarrollo de software para una agencia llamada Digital Emporium.\nTu tarea es generar un borrador de cotización bilingüe (inglés y español) basado en la solicitud de un cliente.\nLa cotización debe incluir un alcance del proyecto, un costo estimado y notas adicionales.\n
SOLICITUD DEL CLIENTE: {{input}}\n
RESPUESTA JSON ESPERADA:
{
  "projectScope": {
    "en": "[Project Scope in English]",
    "es": "[Alcance del Proyecto en Español]",
    "fr": "[Project Scope in French]",
  },
  "costEstimate": {
    "en": "[Cost Estimate in English]",
    "es": "[Estimación de Costo en Español]",
    "fr": "[Cost Estimate in French]",
  },
  "additionalNotes": {
    "en": "[Additional Notes in English]",
    "es": "[Notas Adicionales en Español]",
    "fr": "[Additional Notes in French]",
  }
}`,
});
