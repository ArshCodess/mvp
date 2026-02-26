"use client"
import React, { useEffect, useState } from 'react'
import EventCard from './Eventcard';
import EventCardSkeleton from './EventCardSkeleton';
import EmptyState from './EmptyState';
import Link from 'next/link';

interface CardGridProps {
  search: string
}

function CardGrid({ search }: CardGridProps) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<Array<any>>([])

  const fetchData = async () => {
    setLoading(true)
    try {
      const url = search.length > 0
        ? `/api/dashboard?search=${search}`
        : '/api/dashboard';

      const res = await fetch(url);

      if (!res.ok) {
        setData([])
        throw new Error('Network response was not ok');
      }

      const json = await res.json();
      console.log(json)
      setData(json)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [search])

  return (
    <div className="grid md:mx-0 mx-2 grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
      {loading ? (
        Array.from({ length: 4 }).map((_, index) => (
          <EventCardSkeleton key={index} />
        ))
      ) : data.length === 0 ? (
        <EmptyState search={search} />
      ) : (
        data.map((item, index) => (
          <Link key={index} href={`/events/${item.id}`}>
            <EventCard event={item} />
          </Link>
        ))
      )}
    </div>
  )
}

export default CardGrid