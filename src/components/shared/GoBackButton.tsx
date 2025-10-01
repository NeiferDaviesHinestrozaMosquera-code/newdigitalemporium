
"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import type { Dictionary } from '@/lib/i18n/get-dictionary';

interface GoBackButtonProps {
    dictionary: Dictionary
}

export default function GoBackButton({ dictionary }: GoBackButtonProps) {
  const router = useRouter();

  return (
    <Button variant="outline" onClick={() => router.back()} className="mb-8">
      <ArrowLeft className="mr-2 h-4 w-4" />
      {dictionary.goBack as string}
    </Button>
  );
}
