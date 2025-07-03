
"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wand2 } from "lucide-react";
import type { GenerateQuoteOutput } from "@/ai/flows/generate-quote"; // This is now bilingual
import { generateQuoteAction } from "./actions"; 
import { useRouter } from "next/navigation";

const formSchema = z.object({
  requestDetails: z.string().min(20, {
    message: "Please provide at least 20 characters for the request details.",
  }),
});

type AIQuoteGeneratorFormValues = z.infer<typeof formSchema>;

interface AIQuoteGeneratorClientProps {
  inquiryId: string;
  initialRequestDetails?: string;
}

export default function AIQuoteGeneratorClient({ inquiryId, initialRequestDetails = "" }: AIQuoteGeneratorClientProps) {
  const [generatedQuote, setGeneratedQuote] = useState<GenerateQuoteOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const generatedQuoteCardRef = useRef<HTMLDivElement>(null);

  const form = useForm<AIQuoteGeneratorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      requestDetails: initialRequestDetails,
    },
  });

  useEffect(() => {
    if (generatedQuote && generatedQuoteCardRef.current) {
      generatedQuoteCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest", // Changed from "start" to "nearest"
      });
    }
  }, [generatedQuote]);

  async function onSubmit(values: AIQuoteGeneratorFormValues) {
    setIsLoading(true);
    setGeneratedQuote(null);
    try {
      const result = await generateQuoteAction({ 
        requestDetails: values.requestDetails,
        inquiryId: inquiryId 
      });
      setGeneratedQuote(result);
      toast({
        title: "Bilingual Quote Generated!",
        description: "AI has drafted a project scope and estimate in English and Spanish. The inquiry has been updated.",
      });
      router.refresh(); 
    } catch (error) {
      console.error("Error generating quote:", error);
      toast({
        title: "Error Generating Quote",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Wand2 className="h-6 w-6 text-accent" />
            AI Quote Generator
          </CardTitle>
          <CardDescription>
            Analyze client request details to auto-generate a project scope and cost estimate in English and Spanish. The inquiry will be updated with this quote.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="requestDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Request Details (for AI Analysis)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste or type the client's project request details here..."
                        className="min-h-[120px] text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Generate & Save Bilingual Quote
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {isLoading && (
        <div className="text-center py-4">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-muted-foreground">Generating AI insights (EN/ES)...</p>
        </div>
      )}

      {generatedQuote && !isLoading && (
        <Card ref={generatedQuoteCardRef} className="shadow-md bg-secondary/30">
          <CardHeader>
            <CardTitle className="text-lg text-primary">Generated Bilingual Quote Draft (Saved)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold text-foreground">Project Scope (English):</h4>
              <p className="whitespace-pre-wrap text-muted-foreground p-2 border rounded-md bg-background">{generatedQuote.projectScope.en}</p>
              <h4 className="font-semibold text-foreground mt-2">Alcance del Proyecto (Español):</h4>
              <p className="whitespace-pre-wrap text-muted-foreground p-2 border rounded-md bg-background">{generatedQuote.projectScope.es}</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Cost Estimate (English):</h4>
              <p className="whitespace-pre-wrap text-muted-foreground p-2 border rounded-md bg-background">{generatedQuote.costEstimate.en}</p>
              <h4 className="font-semibold text-foreground mt-2">Estimación de Costo (Español):</h4>
              <p className="whitespace-pre-wrap text-muted-foreground p-2 border rounded-md bg-background">{generatedQuote.costEstimate.es}</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Additional Notes (English):</h4>
              <p className="whitespace-pre-wrap text-muted-foreground p-2 border rounded-md bg-background">{generatedQuote.additionalNotes.en}</p>
              <h4 className="font-semibold text-foreground mt-2">Notas Adicionales (Español):</h4>
              <p className="whitespace-pre-wrap text-muted-foreground p-2 border rounded-md bg-background">{generatedQuote.additionalNotes.es}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
