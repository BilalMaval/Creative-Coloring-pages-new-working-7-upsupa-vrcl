'use client';

import { useState } from 'react';
import { Download, Loader2, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function DownloadButton({ product, gradient }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    setLoading(true);
    
    try {
      if (product.isFree) {
        // Handle free download
        const response = await fetch('/api/download', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id })
        });
        
        const data = await response.json();
        
        if (data.success && data.downloadUrl) {
          // Open download in new tab
          window.open(data.downloadUrl, '_blank');
          alert('Download started! Check your browser downloads.');
        } else {
          alert(data.error || 'Download failed');
        }
      } else {
        // Handle add to cart for paid products
        const response = await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id, quantity: 1 })
        });
        
        const data = await response.json();
        
        if (data.success) {
          // Redirect to cart
          router.push('/cart');
        } else {
          if (response.status === 401) {
            // Not logged in - redirect to login
            router.push(`/login?redirect=/product/${product.slug}`);
          } else {
            alert(data.error || 'Failed to add to cart');
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      size="lg"
      className={`w-full bg-gradient-to-r ${gradient} hover:opacity-90 text-white font-black text-xl md:text-2xl py-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:transform-none`}
    >
      {loading ? (
        <>
          <Loader2 className="mr-3 h-8 w-8 animate-spin" />
          Processing...
        </>
      ) : product.isFree ? (
        <>
          <Download className="mr-3 h-8 w-8" />
          Download FREE
        </>
      ) : (
        <>
          <ShoppingCart className="mr-3 h-8 w-8" />
          Add to Cart - ${Number(product.price).toFixed(2)}
        </>
      )}
    </Button>
  );
}
