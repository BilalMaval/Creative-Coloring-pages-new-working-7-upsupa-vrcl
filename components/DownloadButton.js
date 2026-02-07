'use client';

import { useState } from 'react';
import { Download, Loader2, ShoppingCart, Check, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function DownloadButton({ product, gradient }) {
  const [loading, setLoading] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const router = useRouter();

  const addToCart = () => {
    // Get current cart from localStorage
    const savedCart = localStorage.getItem('cart');
    const cart = savedCart ? JSON.parse(savedCart) : [];
    
    // Check if product already in cart
    const existingIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingIndex >= 0) {
      // Increase quantity
      cart[existingIndex].quantity += 1;
    } else {
      // Add new item
      cart.push({
        id: product.id,
        slug: product.slug,
        title: product.title,
        price: product.price,
        isFree: product.isFree,
        image: product.webpPath || product.thumbnailPath,
        category: product.category?.name || '',
        quantity: 1
      });
    }
    
    // Save cart
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Dispatch event for header cart count update
    window.dispatchEvent(new Event('cartUpdated'));
    
    return true;
  };

  const handleFreeDownload = async () => {
    setLoading(true);
    
    try {
      // For free products, initiate download directly
      if (product.pdfPath) {
        // Track download
        await fetch('/api/download', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id })
        }).catch(() => {}); // Don't block on tracking failure
        
        // Open download in new tab
        window.open(product.pdfPath, '_blank');
      } else {
        alert('Download file not available');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    setLoading(true);
    
    try {
      addToCart();
      setAddedToCart(true);
      
      // Reset after 2 seconds
      setTimeout(() => {
        setAddedToCart(false);
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async () => {
    setLoading(true);
    
    try {
      addToCart();
      router.push('/checkout');
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const goToCart = () => {
    router.push('/cart');
  };

  // FREE PRODUCT - Single download button
  if (product.isFree) {
    return (
      <Button
        onClick={handleFreeDownload}
        disabled={loading}
        size="lg"
        className={`w-full bg-gradient-to-r ${gradient} hover:opacity-90 text-white font-black text-xl md:text-2xl py-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:transform-none`}
      >
        {loading ? (
          <>
            <Loader2 className="mr-3 h-8 w-8 animate-spin" />
            Downloading...
          </>
        ) : (
          <>
            <Download className="mr-3 h-8 w-8" />
            Download FREE
          </>
        )}
      </Button>
    );
  }

  // PAID PRODUCT - Added to cart state
  if (addedToCart) {
    return (
      <div className="space-y-2">
        <Button
          disabled
          size="lg"
          className="w-full bg-green-500 text-white font-black text-xl md:text-2xl py-8 rounded-2xl shadow-2xl"
        >
          <Check className="mr-3 h-8 w-8" />
          Added to Cart!
        </Button>
        <Button
          onClick={goToCart}
          variant="outline"
          size="lg"
          className="w-full font-bold text-lg py-6 rounded-xl"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          View Cart & Checkout
        </Button>
      </div>
    );
  }

  // PAID PRODUCT - Two buttons: Add to Cart and Buy Now
  return (
    <div className="space-y-3">
      <Button
        onClick={handleBuyNow}
        disabled={loading}
        size="lg"
        className={`w-full bg-gradient-to-r ${gradient} hover:opacity-90 text-white font-black text-xl md:text-2xl py-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:transform-none`}
      >
        {loading ? (
          <>
            <Loader2 className="mr-3 h-8 w-8 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Zap className="mr-3 h-8 w-8" />
            Buy Now - ${Number(product.price).toFixed(2)}
          </>
        )}
      </Button>
      <Button
        onClick={handleAddToCart}
        variant="outline"
        size="lg"
        className="w-full font-bold text-lg py-6 rounded-xl border-2"
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        Add to Cart
      </Button>
    </div>
  );
}
