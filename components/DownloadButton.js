'use client';

import { useState } from 'react';
import { Download, Loader2, ShoppingCart, Check, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function DownloadButton({ product, gradient }) {
  const [loading, setLoading] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);
  const router = useRouter();

  const addToCart = () => {
    const savedCart = localStorage.getItem('cart');
    const cart = savedCart ? JSON.parse(savedCart) : [];

    const existingIndex = cart.findIndex(item => item.id === product.id);
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += 1;
    } else {
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

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    return true;
  };



  const handleAddToCart = () => {
    setLoading(true);
    try {
      addToCart();
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = () => {
    setLoading(true);
    try {
      addToCart();
      router.push('/checkout');
    } catch (error) {
      console.error('Error:', errconst handleFreeDownload = () => {
  if (!product.pdfPath) {
    alert('Download file not available. Please contact support.');
    return;
  }

  setDownloadStarted(true);

  const filePath = encodeURIComponent(
    product.pdfPath.replace(/^.*\/uploads\//, '')
  );

  const fileName = encodeURIComponent(
    product.title.replace(/[^a-z0-9]/gi, '_') + '.pdf'
  );

  const url = `/api/download?file=${filePath}&name=${fileName}`;

  // Professional download (no new tab, no flicker)
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName; // Important
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => setDownloadStarted(false), 3000);
};
or);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const goToCart = () => router.push('/cart');

  if (downloadStarted) {
    return (
      <Button
        disabled
        size="lg"
        className="w-full bg-green-500 text-white font-black text-xl md:text-2xl py-8 rounded-2xl shadow-2xl"
      >
        <Check className="mr-3 h-8 w-8" />
        Download Started!
      </Button>
    );
  }

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
            Preparing Download...
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
