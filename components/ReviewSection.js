'use client';

import { useState, useEffect } from 'react';
import { Star, User, ThumbsUp, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function StarRating({ rating, onRatingChange, interactive = false, size = 'md' }) {
  const [hover, setHover] = useState(0);
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };
  
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && onRatingChange?.(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          className={interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
          disabled={!interactive}
        >
          <Star
            className={`${sizeClasses[size]} ${
              star <= (hover || rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export function ProductRating({ rating, reviewCount, size = 'sm' }) {
  return (
    <div className="flex items-center gap-2">
      <StarRating rating={Math.round(rating)} size={size} />
      <span className="text-sm font-bold text-gray-600">
        {rating > 0 ? rating.toFixed(1) : 'No ratings'}
        {reviewCount > 0 && <span className="text-gray-400"> ({reviewCount})</span>}
      </span>
    </div>
  );
}

export default function ReviewSection({ productId, productSlug }) {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ count: 0, averageRating: 0 });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: '',
    authorName: '',
    authorEmail: ''
  });

  useEffect(() => {
    fetchReviews();
  }, [productId, productSlug]);

  const fetchReviews = async () => {
    try {
      const param = productId ? `productId=${productId}` : `slug=${productSlug}`;
      const res = await fetch(`/api/reviews?${param}`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.data);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.authorName || !formData.rating) {
      alert('Please enter your name and rating');
      return;
    }
    
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          productSlug,
          ...formData
        })
      });
      
      const data = await res.json();
      if (data.success) {
        setFormData({ rating: 5, title: '', comment: '', authorName: '', authorEmail: '' });
        setShowForm(false);
        fetchReviews();
      } else {
        alert(data.error || 'Failed to submit review');
      }
    } catch (error) {
      alert('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-black text-gray-800 flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-blue-500" />
            Customer Reviews
          </h3>
          <div className="flex items-center gap-4 mt-2">
            <StarRating rating={Math.round(stats.averageRating)} size="md" />
            <span className="text-lg font-bold text-gray-700">
              {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '0'} out of 5
            </span>
            <span className="text-gray-500">({stats.count} reviews)</span>
          </div>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold"
        >
          Write a Review
        </Button>
      </div>

      {/* Review Form */}
      {showForm && (
        <Card className="mb-6 border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg">Share Your Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Your Rating *</label>
                <StarRating
                  rating={formData.rating}
                  onRatingChange={(rating) => setFormData({ ...formData, rating })}
                  interactive={true}
                  size="lg"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Your Name *</label>
                  <Input
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email (optional)</label>
                  <Input
                    type="email"
                    value={formData.authorEmail}
                    onChange={(e) => setFormData({ ...formData, authorEmail: e.target.value })}
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Review Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Great coloring page!"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Your Review</label>
                <Textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Tell others about your experience..."
                  rows={4}
                />
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" disabled={submitting} className="flex-1">
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="border-l-4 border-l-yellow-400">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-full p-2">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{review.authorName}</p>
                      <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
                    </div>
                  </div>
                  <StarRating rating={review.rating} size="sm" />
                </div>
                {review.title && (
                  <h4 className="font-bold text-gray-800 mb-1">{review.title}</h4>
                )}
                {review.comment && (
                  <p className="text-gray-600">{review.comment}</p>
                )}
                {review.isVerified && (
                  <span className="inline-flex items-center gap-1 text-xs text-green-600 font-bold mt-2">
                    <ThumbsUp className="h-3 w-3" /> Verified Purchase
                  </span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-2">No reviews yet</p>
          <p className="text-sm text-gray-400">Be the first to review this product!</p>
        </div>
      )}
    </div>
  );
}
