interface EmptyStateProps {
  search: string
}

export default function EmptyState({ search }: EmptyStateProps) {
  return (
    <div className="col-span-2 flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-20 h-20 mb-6 rounded-full bg-indigo-50 flex items-center justify-center">
        <svg
          className="w-10 h-10 text-indigo-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
          />
        </svg>
      </div>

      {search.length > 0 ? (
        <>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            No results for &ldquo;{search}&rdquo;
          </h3>
          <p className="text-sm text-gray-500 max-w-xs">
            Try searching with different keywords or browse all events by clearing your search.
          </p>
        </>
      ) : (
        <>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            No events yet
          </h3>
          <p className="text-sm text-gray-500 max-w-xs">
            There are no events to display right now. Check back later or create a new one.
          </p>
        </>
      )}
    </div>
  )
}