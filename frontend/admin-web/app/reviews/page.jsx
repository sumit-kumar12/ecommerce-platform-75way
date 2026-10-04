'use client';

import React, { useState } from 'react';
import { adminRequest } from '../../lib/api';

export default function ReviewsQueuePage() {
  const [filter, setFilter] = useState('All');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const tabs = ['All', 'Pending', 'Approved', 'Rejected'];

  React.useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await adminRequest('/admin-reviews');
      const data = res.data || res || [];
      const mapped = data.map(r => ({
        ...r,
        customer: r.user?.name || 'Unknown User',
        product: r.product?.title || 'Unknown Product',
        text: r.comment || r.text || '',
        date: r.createdAt ? new Date(r.createdAt).toLocaleString() : 'N/A'
      }));
      setReviews(mapped);
    } catch (err) {
      console.error('Failed to load reviews', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter((review) => {
    if (filter === 'All') return true;
    return review.status.toLowerCase() === filter.toLowerCase();
  });

  const handleApprove = (id) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status: 'approved' } : r));
  };

  const handleReject = (id) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          i < rating ? 
            <span key={i} className="material-symbols-outlined text-yellow-400 text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> : 
            <span key={i} className="material-symbols-outlined text-gray-500 text-[16px]">star</span>
        ))}
      </div>
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-400/10 text-yellow-500 border border-yellow-400/20">Pending</span>;
      case 'approved':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-400/10 text-green-400 border border-green-400/20">Approved</span>;
      case 'rejected':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-400/10 text-red-400 border border-red-400/20">Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#0F0E17' }}>
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Reviews Queue</h1>
          <p className="text-sm text-gray-400 mt-1">Manage and moderate customer product reviews.</p>
        </div>

        {/* Filters */}
        <div className="border-b" style={{ borderColor: '#2d2c45' }}>
          <nav className="-mb-px flex space-x-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${filter === tab
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <div 
              className="text-center py-12 rounded-lg border border-dashed"
              style={{ backgroundColor: '#1A1827', borderColor: '#2d2c45' }}
            >
              <p className="text-gray-400">No reviews found for this filter.</p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div 
                key={review.id}
                className="rounded-lg border p-5 transition-colors"
                style={{ backgroundColor: '#1A1827', borderColor: '#2d2c45' }}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  {/* Left content */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-medium text-white">{review.customer}</span>
                      <span className="text-xs text-gray-500">{review.date}</span>
                      <div className="hidden sm:block">{getStatusBadge(review.status)}</div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2">
                      {renderStars(review.rating)}
                      <span className="text-sm font-medium text-gray-300">
                        {review.product}
                      </span>
                    </div>

                    <p className="text-sm text-gray-400 italic">"{review.text}"</p>
                  </div>

                  {/* Mobile badge */}
                  <div className="sm:hidden">
                    {getStatusBadge(review.status)}
                  </div>

                  {/* Actions */}
                  {review.status === 'pending' && (
                    <div className="flex flex-row sm:flex-col lg:flex-row gap-2 w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
                      <button
                        onClick={() => handleApprove(review.id)}
                        className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-white bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 transition-colors flex-1"
                      >
                        <span className="material-symbols-outlined text-green-400 text-[16px]">check_circle</span>
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(review.id)}
                        className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-white bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-colors flex-1"
                      >
                        <span className="material-symbols-outlined text-red-400 text-[16px]">cancel</span>
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div 
          className="flex items-center justify-between border-t py-3"
          style={{ borderColor: '#2d2c45' }}
        >
          <div className="flex flex-1 justify-between sm:hidden">
            <button className="relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-gray-300 hover:bg-[#2d2c45] border border-[#2d2c45] transition-colors">
              Previous
            </button>
            <button className="relative ml-3 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-gray-300 hover:bg-[#2d2c45] border border-[#2d2c45] transition-colors">
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-400">
                Showing <span className="font-medium text-white">1</span> to <span className="font-medium text-white">{filteredReviews.length}</span> of <span className="font-medium text-white">{filteredReviews.length}</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 hover:bg-[#2d2c45] border border-[#2d2c45] focus:z-20 transition-colors">
                  <span className="sr-only">Previous</span>
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button aria-current="page" className="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 border border-indigo-600">
                  1
                </button>
                <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-400 hover:bg-[#2d2c45] border border-[#2d2c45] focus:z-20 transition-colors">
                  2
                </button>
                <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 hover:bg-[#2d2c45] border border-[#2d2c45] focus:z-20 transition-colors">
                  <span className="sr-only">Next</span>
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </nav>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
