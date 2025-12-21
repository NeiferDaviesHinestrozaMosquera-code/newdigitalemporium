
import type { Testimonial } from '@/lib/placeholder-data';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const fallbackInitials = testimonial.name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 bg-secondary/30 hover:-translate-y-1 rounded-lg">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            {testimonial.avatar && (
              <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint={testimonial.dataAiHint} />
            )}
            <AvatarFallback>{fallbackInitials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-primary">{testimonial.name}</p>
            {testimonial.company && (
              <p className="text-sm text-muted-foreground">{testimonial.company}</p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <blockquote className="italic text-foreground/80">
          "{testimonial.quote}"
        </blockquote>
      </CardContent>
    </Card>
  );
}
