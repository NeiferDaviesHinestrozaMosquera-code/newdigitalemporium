"use client";

import type { Service } from "@/lib/placeholder-data";
import { iconMap } from "@/lib/placeholder-data";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowRight, HelpCircle, X } from "lucide-react";
import type { Locale } from "@/lib/i18n/i18n-config";
import { motion } from "framer-motion";
import { useState } from "react";

interface ServiceCardProps {
  service: Service;
  lang: Locale;
}

export default function ServiceCard({ service, lang }: ServiceCardProps) {
  const IconComponent = iconMap[service.iconName] || HelpCircle;
  const [isOpen, setIsOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: "-100px" }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Card className="group flex flex-col h-full shadow-lg hover:shadow-2xl transition-all duration-300 rounded-lg overflow-hidden hover:-translate-y-2 border border-primary/10 hover:border-primary/30">
        {/* Image Section with Overlay */}
        <CardHeader className="p-0 relative overflow-hidden">
          {service.image && (
            <div className="relative w-full h-48 rounded-t-lg overflow-hidden">
              <motion.div
                className="relative w-full h-full"
                animate={isHovering ? { scale: 1.1 } : { scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={service.image}
                  alt={service.title}
                  fill={true}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                  className="transition-transform duration-300 ease-in-out"
                  data-ai-hint={service.dataAiHint}
                  unoptimized={true} 
                />
              </motion.div>

              {/* Animated overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"
                initial={{ opacity: 0 }}
                animate={isHovering ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}

          {/* Icon and Title Section */}
          <motion.div
            className="p-6 text-center"
            animate={isHovering ? { y: -5 } : { y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4 group-hover:bg-primary/20 transition-colors"
              animate={isHovering ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
              transition={{ duration: 0.3 }}
            >
              <IconComponent className="w-8 h-8" />
            </motion.div>
            <CardTitle className="text-xl font-semibold mb-2 text-primary group-hover:text-primary/80 transition-colors">
              {service.title}
            </CardTitle>
            <CardDescription className="text-sm text-foreground/75 min-h-[3rem] line-clamp-2">
              {service.shortDescription}
            </CardDescription>
          </motion.div>
        </CardHeader>

        {/* Content Section */}
        <CardContent className="px-6 pb-6 pt-0 flex-grow">
          <motion.p
            className="text-sm text-muted-foreground line-clamp-3"
            animate={isHovering ? { color: "rgb(var(--foreground) / 0.9)" } : {}}
            transition={{ duration: 0.3 }}
          >
            {service.description}
          </motion.p>
        </CardContent>

        {/* Footer with Price and Button */}
        <CardFooter className="px-6 pb-6 pt-4 border-t border-primary/10 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-between sm:items-center">
          <motion.p
            className="text-lg font-semibold text-accent text-center sm:text-left"
            animate={isHovering ? { scale: 1.05 } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {service.priceInfo}
          </motion.p>

          {/* Learn More Dialog */}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto transition-all duration-300">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </DialogTrigger>

            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-lg">
              <DialogHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <DialogTitle className="text-2xl font-bold text-primary">
                      {service.title}
                    </DialogTitle>
                    <DialogDescription className="mt-2 text-base">
                      {service.shortDescription}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Service Image */}
                {service.image && (
                  <div className="relative w-full h-64 rounded-lg overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      unoptimized={true} 
                    />
                  </div>
                )}

                {/* Full Description */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-primary">
                    Service Details
                  </h3>
                  <p className="text-foreground/80 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Price Info */}
                <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-1">
                    Pricing Information
                  </p>
                  <p className="text-2xl font-bold text-accent">
                    {service.priceInfo}
                  </p>
                </div>

                {/* Call to Action */}
                <motion.div
                  className="flex gap-3 pt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button
                    asChild
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Link href={`/${lang}/quote-request`}>
                      Get a Quote
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsOpen(false)}
                  >
                    Close
                  </Button>
                </motion.div>
              </motion.div>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
