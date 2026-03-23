import { useId } from "react";

interface StarRatingProps {
  rating: number;
  reviews?: number;
  compact?: boolean;
}

export function StarRating({ rating, reviews, compact }: StarRatingProps) {
  const gradientId = useId();

  if (compact) {
    return (
      <div className="flex items-center gap-1.5" role="img" aria-label={`${rating} de 5`}>
        <span className="mono text-sm font-semibold" style={{ color: 'var(--accent)' }}>
          {rating}
        </span>
        <svg className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        {reviews !== undefined && (
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            ({reviews.toLocaleString("es-ES")})
          </span>
        )}
      </div>
    );
  }

  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.25 && rating % 1 < 0.75;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-1" role="img" aria-label={`${rating} de 5 estrellas`}>
      {Array.from({ length: fullStars }).map((_, i) => (
        <svg key={`f-${i}`} className="w-4 h-4" style={{ color: 'var(--accent)' }} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      {hasHalf && (
        <svg className="w-4 h-4" viewBox="0 0 20 20" aria-hidden="true">
          <defs>
            <linearGradient id={gradientId}>
              <stop offset="50%" stopColor="#c47a3a" />
              <stop offset="50%" stopColor="#e5e0d8" />
            </linearGradient>
          </defs>
          <path fill={`url(#${gradientId})`} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <svg key={`e-${i}`} className="w-4 h-4" style={{ color: 'var(--border-dark)' }} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      {reviews !== undefined && (
        <span className="text-xs ml-1" style={{ color: 'var(--text-muted)' }}>
          {rating} ({reviews.toLocaleString("es-ES")})
        </span>
      )}
    </div>
  );
}
