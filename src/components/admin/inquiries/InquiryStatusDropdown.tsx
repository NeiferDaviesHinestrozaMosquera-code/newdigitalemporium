
"use client";

import type { ClientInquiryStatus } from "@/lib/placeholder-data";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, FileText as FileTextIconLucide, CheckCircle, Archive } from "lucide-react";
import { updateInquiryStatusAction } from "@/components/admin/actions";
import { useRouter } from "next/navigation";

interface InquiryStatusDropdownProps {
  inquiryId: string;
  currentStatus: ClientInquiryStatus;
  allStatuses: ClientInquiryStatus[];
}

export default function InquiryStatusDropdown({
  inquiryId,
  currentStatus,
  allStatuses,
}: InquiryStatusDropdownProps) {
  const router = useRouter();

  const handleStatusChange = async (newStatus: ClientInquiryStatus) => {
    try {
      await updateInquiryStatusAction(inquiryId, newStatus);
      router.refresh(); // Refresh data on the page
    } catch (error) {
      console.error("Failed to update inquiry status:", error);
      // Optionally, add a toast notification for errors here
      // import { useToast } from "@/hooks/use-toast";
      // const { toast } = useToast();
      // toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" title="Change Status">
          <Edit className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {allStatuses.map((status) => (
          <DropdownMenuItem
            key={status}
            disabled={currentStatus === status}
            onSelect={() => handleStatusChange(status)} // onSelect now calls a local async handler
          >
            {status === 'New' && <FileTextIconLucide className="mr-2 h-4 w-4" />}
            {status === 'Contacted' && <CheckCircle className="mr-2 h-4 w-4 text-blue-500" />}
            {status === 'Quoted' && <FileTextIconLucide className="mr-2 h-4 w-4 text-yellow-500" />}
            {status === 'Closed' && <Archive className="mr-2 h-4 w-4 text-red-500" />}
            Mark as {status}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
