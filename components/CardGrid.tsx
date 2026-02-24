"use client"
import React, { useEffect, useState } from 'react'
import EventCard from './Eventcard';
import Link from 'next/link';

interface CardGridProps {
    search: string
}

function CardGrid({ search }: CardGridProps) {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<Array<any>>([])
    const fetchData = async () => {
        if (search.length > 0) {
            try {
                const res = await fetch(`/api/dashboard?search=${search}`);

                if (!res.ok) {
                    setData([])
                    throw new Error('Network response was not ok');
                }
                res.json().then(data => {
                    console.log(data)
                    setData(data)
                    setLoading(false)
                })
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }
        else {
            try {
                const res = await fetch('/api/dashboard');

                if (!res.ok) {
                    setData([])
                    throw new Error('Network response was not ok');
                }
                res.json().then(data => {
                    console.log(data)
                    setData(data)
                    setLoading(false)
                })
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }
    }
    useEffect(() => {
        fetchData()
        console.log(data)
    },[search])
    if (loading)
        return <div>Loading...</div>
    return (
        <div className="grid md:mx-0 mx-2 grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {
                data && data.map((item, index) => (
                    <Link key={index} href={`/events/${item.id}`}>
                        <EventCard event={item} />
                    </Link>
                ))
            }
        </div>

    )
}

export default CardGrid