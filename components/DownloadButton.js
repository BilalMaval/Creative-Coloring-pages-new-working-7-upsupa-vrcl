'use client';

import { useState } from 'react';
import { Download, Loader2, ShoppingCart, Check } from 'lucide-react';
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

  const handleClick = async () => {
    setLoading(true);
    
    try {
      if (product.isFree) {
        // Handle free download - add to cart and go to checkout directly
        addToCart();
        router.push('/checkout');
      } else {
        // Handle add to cart for paid products
        addToCart();
        setAddedToCart(true);
        
        // Reset after 2 seconds
        setTimeout(() => {
          setAddedToCart(false);
        }, 2000);
      }
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
