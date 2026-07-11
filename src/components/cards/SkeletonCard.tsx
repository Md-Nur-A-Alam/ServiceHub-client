export function SkeletonCard() {
  return (
    <div className="flex flex-col bg-surface border border-outline-variant rounded-2xl overflow-hidden animate-pulse h-full">
      {/* Image container skeleton */}
      <div className="relative w-full aspect-[4/3] bg-surface-variant flex items-center justify-center overflow-hidden">
        {/* Placeholder for badge */}
        <div className="absolute top-3 left-3 w-20 h-6 rounded-full bg-surface-container-high"></div>
        {/* Placeholder for heart */}
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-container-high"></div>
      </div>

      {/* Card body skeleton */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div>
          {/* Title skeleton */}
          <div className="h-4 bg-surface-variant rounded w-3/4 mb-2"></div>
          {/* Provider name skeleton */}
          <div className="h-3 bg-surface-variant rounded w-1/2"></div>
        </div>

        {/* Short desc skeleton */}
        <div className="space-y-2 mt-1">
          <div className="h-3 bg-surface-variant rounded w-full"></div>
          <div className="h-3 bg-surface-variant rounded w-4/5"></div>
        </div>

        {/* Rating/Location skeleton */}
        <div className="flex items-center gap-3 mt-1">
          <div className="h-4 bg-surface-variant rounded w-12"></div>
          <div className="h-4 bg-surface-variant rounded w-20"></div>
        </div>

        {/* Price + CTA skeleton */}
        <div className="mt-auto pt-3 border-t border-outline-variant flex items-center justify-between gap-2">
          {/* Price skeleton */}
          <div className="h-6 bg-surface-variant rounded w-16"></div>
          {/* Button skeleton */}
          <div className="h-8 bg-surface-variant rounded-lg w-24"></div>
        </div>
      </div>
    </div>
  );
}
