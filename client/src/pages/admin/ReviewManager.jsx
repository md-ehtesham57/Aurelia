import { useState } from 'react';
import { useGetAllReviewsQuery, useModerateReviewMutation } from '../../features/reviews/reviewApi';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const ReviewManager = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const { data, isLoading } = useGetAllReviewsQuery({ status: statusFilter || undefined });
  const [moderateReview] = useModerateReviewMutation();
  const reviews = data?.data?.reviews || [];

  const handleModerate = async (id, status) => {
    try {
      await moderateReview({ id, status }).unwrap();
      toast.success(`Review ${status}`);
    } catch {
      toast.error('Failed to moderate review');
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-sm bg-surface border border-bg rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="space-y-3">
        {reviews.length === 0 ? (
          <p className="text-text-muted text-center py-12">No reviews found</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="bg-surface rounded p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{review.user?.name || 'Unknown'}</span>
                    <span className="text-xs text-text-muted">on</span>
                    <span className="text-sm text-primary truncate">{review.product?.title}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i} className={`text-xs ${i < review.rating ? 'text-primary' : 'text-bg'}`}>&#9733;</span>
                    ))}
                  </div>
                  {review.comment && <p className="text-sm text-text-muted">{review.comment}</p>}
                  <p className="text-xs text-text-muted">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`text-xs capitalize px-2 py-0.5 rounded-full shrink-0 ${
                  review.status === 'approved' ? 'bg-green-100 text-green-700' :
                  review.status === 'rejected' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {review.status}
                </span>
              </div>
              {review.status === 'pending' && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-bg">
                  <Button size="sm" onClick={() => handleModerate(review._id, 'approved')}>Approve</Button>
                  <Button size="sm" variant="ghost" onClick={() => handleModerate(review._id, 'rejected')}>Reject</Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewManager;
