'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

export default function PrintableCard({ printable }) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/printable/${printable.slug}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          {printable.image ? (
            <Image
              src={printable.image}
              alt={printable.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
        </div>
      </Link>
      
      <CardContent className="p-4">
        <Link href={`/printable/${printable.slug}`}>
          <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
            {printable.title}
          </h3>
        </Link>
        {printable.description && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {printable.description}
          </p>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Link href={`/printable/${printable.slug}`} className="w-full">
          <Button variant="outline" className="w-full" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}