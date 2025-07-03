
"use client";

import type { ClientInquiry, ClientInquiryStatus } from "@/lib/placeholder-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Eye, Info, Phone, AlertCircle, Loader2, Wand2 } from "lucide-react";
import AIQuoteGeneratorClient from "@/components/admin/AIQuoteGeneratorClient";
import { format } from 'date-fns';
import { updateInquiryStatusAction } from "@/components/admin/actions"; 
import InquiryStatusDropdown from "@/components/admin/inquiries/InquiryStatusDropdown";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase/config";
import { ref, onValue, query, orderByChild } from "firebase/database"; 
import type { Locale } from '@/lib/i18n/i18n-config';
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";


interface GetInquiriesResult {
  data: ClientInquiry[];
  error?: string;
}

export default function AdminInquiriesPage() {
  const paramsHook = useParams();
  const lang = (paramsHook.lang as Locale) || 'en';

  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [clientInquiries, setClientInquiries] = useState<ClientInquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<ClientInquiry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const inquiryStatuses: ClientInquiryStatus[] = ['New', 'Contacted', 'Quoted', 'Closed'];

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return; 
    }

    const inquiriesRef = query(ref(db, 'inquiries'), orderByChild('date')); 

    const unsubscribe = onValue(inquiriesRef, (snapshot) => {
      if (snapshot.exists()) {
        const inquiriesObject = snapshot.val();
        if (typeof inquiriesObject === 'object' && inquiriesObject !== null) {
          const inquiriesArray = Object.keys(inquiriesObject)
            .map(key => ({ id: key, ...inquiriesObject[key] }))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); 
          setClientInquiries(inquiriesArray as ClientInquiry[]);
          
          const selectedIdFromUrl = searchParams.get('id') || searchParams.get('newInquiryId');
          if (selectedIdFromUrl) {
            const found = inquiriesArray.find(inq => inq.id === selectedIdFromUrl);
            setSelectedInquiry(found || (inquiriesArray.length > 0 ? inquiriesArray[0] : null));
          } else if (inquiriesArray.length > 0 && !selectedInquiry) {
            setSelectedInquiry(inquiriesArray[0]);
          } else if (selectedInquiry) {
            const currentSelectionStillExists = inquiriesArray.find(inq => inq.id === selectedInquiry.id);
            if (!currentSelectionStillExists && inquiriesArray.length > 0) {
                 setSelectedInquiry(inquiriesArray[0]); 
            } else if (!currentSelectionStillExists && inquiriesArray.length === 0) {
                setSelectedInquiry(null);
            } else {
                setSelectedInquiry(currentSelectionStillExists || null); 
            }
          }


        } else {
          setClientInquiries([]);
          setSelectedInquiry(null);
        }
      } else {
        setClientInquiries([]);
        setSelectedInquiry(null);
      }
      setIsLoading(false);
      setFetchError(null);
    }, (error: any) => {
      let errorMessage = "Failed to fetch inquiries from Firebase.";
      if (error.code === "PERMISSION_DENIED") {
        errorMessage = "Firebase permission denied. Check Realtime Database security rules for '/inquiries'.";
      } else {
        errorMessage = error.message || "An unknown error occurred while fetching inquiries.";
      }
      console.error("Error fetching inquiries (onValue):", error.message, error.code);
      setFetchError(errorMessage);
      setIsLoading(false);
      setClientInquiries([]);
      setSelectedInquiry(null);
    });

    return () => unsubscribe();
  }, [user, searchParams, selectedInquiry?.id, lang]);


  useEffect(() => {
    const inquiryIdFromParams = searchParams.get('id');
    if (inquiryIdFromParams && clientInquiries.length > 0) {
      const foundInquiry = clientInquiries.find(inq => inq.id === inquiryIdFromParams);
      if (foundInquiry && foundInquiry.id !== selectedInquiry?.id) {
        setSelectedInquiry(foundInquiry);
      }
    }
  }, [searchParams, clientInquiries, selectedInquiry?.id]);


  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Loading inquiries...</p>
      </div>
    );
  }
  
  if (fetchError) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-primary">Client Inquiries</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Fetching Inquiries</AlertTitle>
          <AlertDescription>
            {fetchError}
            <p className="mt-2">Please ensure your Firebase Realtime Database security rules allow read access to the '/inquiries' path, or check your network connection.</p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  const newInquiryIdParam = searchParams.get('newInquiryId');
  const statusParam = searchParams.get('status');

  return (
    <div className="space-y-8">
      {statusParam === 'success' && newInquiryIdParam && (
        <Alert variant="default" className="bg-green-50 border-green-200 text-green-700 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300">
          <Info className="h-4 w-4 !text-green-700 dark:!text-green-300" />
          <AlertTitle>Inquiry Submitted!</AlertTitle>
          <AlertDescription>
            The new inquiry (ID: {newInquiryIdParam}) has been successfully logged.
          </AlertDescription>
        </Alert>
      )}
      <h1 className="text-3xl font-bold text-primary">Client Inquiries</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">All Inquiries</CardTitle>
              <CardDescription>View and manage all client quote requests.</CardDescription>
            </CardHeader>
            <CardContent className="max-h-[65vh] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientInquiries.map((inquiry) => (
                    <TableRow 
                      key={inquiry.id} 
                      className={selectedInquiry?.id === inquiry.id ? "bg-muted/50" : "cursor-pointer hover:bg-muted/30"}
                      onClick={() => router.push(`/${lang}/admin/inquiries?id=${inquiry.id}`)}
                    >
                      <TableCell>
                        <div className="font-medium">{inquiry.name}</div>
                        <div className="text-xs text-muted-foreground hidden sm:block">{inquiry.email}</div>
                        {inquiry.phoneNumber && <div className="text-xs text-muted-foreground hidden sm:flex items-center gap-1"><Phone size={12}/> {inquiry.phoneNumber}</div>}
                        {inquiry.company && <div className="text-xs text-muted-foreground hidden sm:block"><em>{inquiry.company}</em></div>}
                      </TableCell>
                      <TableCell>{inquiry.serviceRequested}</TableCell>
                      <TableCell className="hidden md:table-cell">{format(new Date(inquiry.date), "MMM d, yyyy")}</TableCell>
                      <TableCell>
                         <Badge variant={
                          inquiry.status === 'New' ? 'default' :
                          inquiry.status === 'Contacted' ? 'secondary' :
                          inquiry.status === 'Quoted' ? 'outline' : 
                          'destructive'
                        }
                        className={
                            inquiry.status === 'New' ? 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700' :
                            inquiry.status === 'Contacted' ? 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700' :
                            inquiry.status === 'Quoted' ? 'bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-700' : 
                            'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600' // Closed
                        }
                        >
                          {inquiry.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/${lang}/admin/inquiries?id=${inquiry.id}`} title="View Details">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <InquiryStatusDropdown
                          inquiryId={inquiry.id}
                          currentStatus={inquiry.status}
                          allStatuses={inquiryStatuses}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {clientInquiries.length === 0 && (
                <p className="p-4 text-center text-muted-foreground">No inquiries found.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1"> 
          <div className="sticky top-6 z-10 mb-6"> 
            {selectedInquiry ? (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">Inquiry Details</CardTitle>
                  <CardDescription>From: {selectedInquiry.name} ({selectedInquiry.email})</CardDescription>
                  {selectedInquiry.company && <CardDescription>Company: {selectedInquiry.company}</CardDescription>}
                  {selectedInquiry.phoneNumber && (
                    <CardDescription className="flex items-center gap-1">
                      <Phone size={14} className="text-muted-foreground"/> {selectedInquiry.phoneNumber}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p><strong>Service Requested:</strong> {selectedInquiry.serviceRequested}</p>
                  <p><strong>Date:</strong> {format(new Date(selectedInquiry.date), "PPP p")}</p>
                  <div className="flex items-center gap-2">
                    <strong>Status:</strong> 
                    <Badge variant={
                          selectedInquiry.status === 'New' ? 'default' :
                          selectedInquiry.status === 'Contacted' ? 'secondary' :
                          selectedInquiry.status === 'Quoted' ? 'outline' : 
                          'destructive'
                          }
                          className={
                              selectedInquiry.status === 'New' ? 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700' :
                              selectedInquiry.status === 'Contacted' ? 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700' :
                              selectedInquiry.status === 'Quoted' ? 'bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-700' : 
                              'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
                          }
                      >
                          {selectedInquiry.status}
                      </Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold">Request Details:</h4>
                    <div className="whitespace-pre-wrap p-2 border rounded-md bg-muted/30 text-xs max-h-40 overflow-y-auto dark:bg-muted/20">{selectedInquiry.details}</div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start gap-3">
                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                                <Wand2 className="mr-2 h-4 w-4" /> Generate AI Quote
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] max-h-[85vh] flex flex-col">
                            <DialogHeader className="p-6 border-b flex-shrink-0">
                                <DialogTitle>AI Quote Generator</DialogTitle>
                                <DialogDescription>
                                    Analyze client request for inquiry: "{selectedInquiry.name} - {selectedInquiry.serviceRequested}".
                                    The inquiry will be updated with the generated quote.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="overflow-y-auto flex-grow p-6">
                                {selectedInquiry && (
                                    <AIQuoteGeneratorClient 
                                        key={selectedInquiry.id} 
                                        inquiryId={selectedInquiry.id}
                                        initialRequestDetails={selectedInquiry.details}
                                    />
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>

                    <div className="flex flex-wrap gap-2 w-full justify-start pt-2 border-t mt-2">
                        {inquiryStatuses.map(status => (
                            <form 
                                key={status} 
                                action={updateInquiryStatusAction.bind(null, selectedInquiry!.id!, status)}
                            >
                                <Button 
                                    type="submit" 
                                    variant="outline" 
                                    size="sm"
                                    disabled={!selectedInquiry || selectedInquiry.status === status}
                                    className="text-xs"
                                >
                                Mark as {status}
                                </Button>
                            </form>
                        ))}
                    </div>
                </CardFooter>
              </Card>
            ) : (
              <Card className="shadow-lg"> 
                  <CardContent className="p-6 text-center text-muted-foreground">
                      Select an inquiry from the list to view details, generate a quote, or update status.
                  </CardContent>
              </Card>
            )}
          </div>
          
          <div className="space-y-6">
            {selectedInquiry?.generatedQuote && (
              <Card className="shadow-md bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-700">
                <CardHeader>
                  <CardTitle className="text-lg text-green-700 dark:text-green-300">Previously Generated Quote (Bilingual)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div>
                    <h4 className="font-semibold text-green-600 dark:text-green-400">Project Scope (English):</h4>
                    <div className="whitespace-pre-wrap text-green-800/80 dark:text-green-200/80 p-1 border border-green-200 dark:border-green-600 rounded-md bg-white dark:bg-background max-h-32 overflow-y-auto">{selectedInquiry.generatedQuote.projectScope.en}</div>
                    <h4 className="font-semibold text-green-600 dark:text-green-400 mt-1.5">Alcance del Proyecto (Español):</h4>
                    <div className="whitespace-pre-wrap text-green-800/80 dark:text-green-200/80 p-1 border border-green-200 dark:border-green-600 rounded-md bg-white dark:bg-background max-h-32 overflow-y-auto">{selectedInquiry.generatedQuote.projectScope.es}</div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-600 dark:text-green-400">Cost Estimate (English):</h4>
                    <div className="whitespace-pre-wrap text-green-800/80 dark:text-green-200/80 p-1 border border-green-200 dark:border-green-600 rounded-md bg-white dark:bg-background max-h-32 overflow-y-auto">{selectedInquiry.generatedQuote.costEstimate.en}</div>
                    <h4 className="font-semibold text-green-600 dark:text-green-400 mt-1.5">Estimación de Costo (Español):</h4>
                    <div className="whitespace-pre-wrap text-green-800/80 dark:text-green-200/80 p-1 border border-green-200 dark:border-green-600 rounded-md bg-white dark:bg-background max-h-32 overflow-y-auto">{selectedInquiry.generatedQuote.costEstimate.es}</div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-600 dark:text-green-400">Additional Notes (English):</h4>
                    <div className="whitespace-pre-wrap text-green-800/80 dark:text-green-200/80 p-1 border border-green-200 dark:border-green-600 rounded-md bg-white dark:bg-background max-h-32 overflow-y-auto">{selectedInquiry.generatedQuote.additionalNotes.en}</div>
                    <h4 className="font-semibold text-green-600 dark:text-green-400 mt-1.5">Notas Adicionales (Español):</h4>
                    <div className="whitespace-pre-wrap text-green-800/80 dark:text-green-200/80 p-1 border border-green-200 dark:border-green-600 rounded-md bg-white dark:bg-background max-h-32 overflow-y-auto">{selectedInquiry.generatedQuote.additionalNotes.es}</div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
