export default function EventCardSkeleton() {
  return (
    <div className="w-full relative bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Image area */}
      <div className="relative h-48 bg-gray-200 animate-pulse">
        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <div className="h-6 w-20 bg-gray-300 rounded-full animate-pulse" />
        </div>
      </div>

      <div className="p-6">
        {/* Title */}
        <div className="h-6 w-3/4 bg-gray-200 rounded-lg animate-pulse mb-2" />

        {/* Description lines */}
        <div className="space-y-2 mb-4">
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Date + time row */}
        <div className="flex items-center gap-2 mb-2">
          <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-4 bg-gray-200 rounded animate-pulse ml-2" />
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Location row */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}