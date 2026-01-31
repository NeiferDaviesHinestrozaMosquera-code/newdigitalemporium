import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Eye, FileText, Clock, Sparkles, DollarSign, Calendar,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  updateQuoteRequest, subscribeToQuoteRequests,
} from '@/services/firebase';
import type { QuoteRequest, AIReport } from '@/types';

// Mock AI generation - In real implementation, this would call Google's Gemini API
const generateAIReport = async (_projectDetails: string, service: string): Promise<AIReport> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock response based on service type
  const baseCost = service.includes('Web') ? 5000 :
                   service.includes('AI') ? 8000 :
                   service.includes('Mobile') ? 12000 :
                   service.includes('E-Commerce') ? 10000 : 3000;

  return {
    estimatedTime: '4-6 weeks',
    totalCost: baseCost + Math.floor(Math.random() * 2000),
    partialCosts: {
      development: Math.floor(baseCost * 0.5),
      design: Math.floor(baseCost * 0.2),
      testing: Math.floor(baseCost * 0.15),
      deployment: Math.floor(baseCost * 0.15),
    },
    difficultyLevel: Math.random() > 0.6 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low',
    requiredTeamMembers: Math.floor(Math.random() * 3) + 2,
    recommendedTechnologies: ['React', 'Node.js', 'MongoDB', 'AWS'],
    additionalNotes: 'Project requires careful planning and regular client communication.',
  };
};

export function ClientInquiries() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const itemsPerPage = 8;

  useEffect(() => {
    const unsubscribe = subscribeToQuoteRequests((data) => {
      setQuotes(data);
    });
    return unsubscribe;
  }, []);

  const handleGenerateReport = async (quote: QuoteRequest) => {
    if (quote.aiReport) {
      setSelectedQuote(quote);
      return;
    }

    setIsGeneratingReport(true);
    try {
      const report = await generateAIReport(quote.projectDetails, quote.service);
      await updateQuoteRequest(quote.id, { aiReport: report });
      toast.success('AI report generated successfully');
      setSelectedQuote({ ...quote, aiReport: report });
    } catch (error) {
      toast.error('Failed to generate AI report');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleStatusChange = async (quoteId: string, newStatus: string) => {
    try {
      await updateQuoteRequest(quoteId, { status: newStatus as any });
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  // Pagination
  const filteredQuotes = quotes.filter(q => {
    const matchesSearch = q.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const totalPages = Math.ceil(filteredQuotes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentQuotes = filteredQuotes.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-700';
      case 'reviewed': return 'bg-blue-500/20 text-blue-700';
      case 'quoted': return 'bg-purple-500/20 text-purple-700';
      case 'approved': return 'bg-green-500/20 text-green-700';
      case 'rejected': return 'bg-red-500/20 text-red-700';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Client Inquiries</h1>
        <p className="text-muted-foreground">Manage quote requests and generate AI reports</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search inquiries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="reviewed">Reviewed</SelectItem>
            <SelectItem value="quoted">Quoted</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Requests', value: quotes.length, icon: FileText, color: 'bg-blue-500' },
          { label: 'Pending', value: quotes.filter(q => q.status === 'pending').length, icon: Clock, color: 'bg-yellow-500' },
          { label: 'Quoted', value: quotes.filter(q => q.status === 'quoted').length, icon: DollarSign, color: 'bg-green-500' },
          { label: 'Avg Response Time', value: '2.5h', icon: Calendar, color: 'bg-purple-500' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quotes Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">Client</th>
                  <th className="text-left p-4 font-medium">Service</th>
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentQuotes.map((quote, index) => (
                  <motion.tr
                    key={quote.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border hover:bg-muted/30"
                  >
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{quote.fullName}</p>
                        <p className="text-sm text-muted-foreground">{quote.email}</p>
                      </div>
                    </td>
                    <td className="p-4">{quote.service}</td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(quote.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <Select
                        value={quote.status}
                        onValueChange={(value) => handleStatusChange(quote.id, value)}
                      >
                        <SelectTrigger className={`w-32 ${getStatusColor(quote.status)}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="reviewed">Reviewed</SelectItem>
                          <SelectItem value="quoted">Quoted</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedQuote(quote)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleGenerateReport(quote)}
                          disabled={isGeneratingReport}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
                        >
                          {isGeneratingReport ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                            />
                          ) : quote.aiReport ? (
                            <FileText className="w-4 h-4" />
                          ) : (
                            <Sparkles className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredQuotes.length)} of {filteredQuotes.length} inquiries
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quote Details Dialog */}
      <Dialog open={!!selectedQuote} onOpenChange={() => setSelectedQuote(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedQuote && (
            <>
              <DialogHeader>
                <DialogTitle>Quote Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name</Label>
                    <p className="font-medium">{selectedQuote.fullName}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="font-medium">{selectedQuote.email}</p>
                  </div>
                  <div>
                    <Label>Company</Label>
                    <p className="font-medium">{selectedQuote.company || 'N/A'}</p>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <p className="font-medium">{selectedQuote.phone}</p>
                  </div>
                  <div>
                    <Label>Service</Label>
                    <p className="font-medium">{selectedQuote.service}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <p className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedQuote.status)}`}>
                      {selectedQuote.status}
                    </p>
                  </div>
                </div>

                <div>
                  <Label>Project Details</Label>
                  <div className="p-4 bg-muted/50 rounded-lg mt-2">
                    <p className="whitespace-pre-wrap">{selectedQuote.projectDetails}</p>
                  </div>
                </div>

                <div>
                  <Label>Submitted</Label>
                  <p className="text-muted-foreground">
                    {new Date(selectedQuote.createdAt).toLocaleString()}
                  </p>
                </div>

                {selectedQuote.aiReport && (
                  <div className="p-4 border border-primary/20 rounded-lg bg-primary/5">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      AI Generated Report
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Estimated Time</Label>
                        <p className="font-medium">{selectedQuote.aiReport.estimatedTime}</p>
                      </div>
                      <div>
                        <Label>Total Cost</Label>
                        <p className="font-medium text-green-600">${selectedQuote.aiReport.totalCost.toLocaleString()}</p>
                      </div>
                      <div>
                        <Label>Difficulty Level</Label>
                        <p className="font-medium capitalize">{selectedQuote.aiReport.difficultyLevel}</p>
                      </div>
                      <div>
                        <Label>Team Size</Label>
                        <p className="font-medium">{selectedQuote.aiReport.requiredTeamMembers} members</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label>Cost Breakdown</Label>
                      <div className="space-y-2 mt-2">
                        <div className="flex justify-between">
                          <span>Development</span>
                          <span className="font-medium">${selectedQuote.aiReport.partialCosts.development.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Design</span>
                          <span className="font-medium">${selectedQuote.aiReport.partialCosts.design.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Testing</span>
                          <span className="font-medium">${selectedQuote.aiReport.partialCosts.testing.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Deployment</span>
                          <span className="font-medium">${selectedQuote.aiReport.partialCosts.deployment.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label>Recommended Technologies</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedQuote.aiReport.recommendedTechnologies.map((tech) => (
                          <span key={tech} className="px-3 py-1 bg-primary/10 rounded-full text-sm">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label>Additional Notes</Label>
                      <p className="text-muted-foreground mt-1">{selectedQuote.aiReport.additionalNotes}</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
