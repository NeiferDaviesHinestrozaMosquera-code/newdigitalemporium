
"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function GoBackButton({ label }: { label: string }) {
  return (
    <Button asChild variant="outline" size="lg">
      <Link href="#" onClick={(e) => { e.preventDefault(); window.history.back(); }}>
        <ArrowLeft className="mr-2 h-5 w-5" />
        {label}
      </Link>
    </Button>
  );
}
