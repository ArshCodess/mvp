"use client"
import CardGrid from "@/components/CardGrid"
import { giveCommand } from "@/lib/ai"
import { useState } from "react"

function CardWithSearch() {
  const [search, setSearch] = useState('')
  return (
    <div className="space-y-4 w-full relative flex flex-col ">
      <input 
        type="text" 
        onChange={(e) => setSearch(e.target.value)} 
        placeholder="Search events..." 
        className=" px-4 py-2 border md:mt-3 mt-2 lg:mt-4 border-gray-300 rounded-lg focus:outline-none focus:ring-0 "
      />
      <button onClick={()=>giveCommand("Create an event for a music concert on 25th December at 7 PM in Central Park with a capacity of 500 people. The event will feature live performances by popular bands and artists. The description of the event is 'Join us for an unforgettable night of music and entertainment at Central Park! Enjoy live performances by top bands and artists, delicious food, and a vibrant atmosphere. Don't miss out on this incredible music concert!' The image URL for the event is 'https://example.com/concert.jpg'. The highlights of the event include live performances, food stalls, and a vibrant atmosphere. The rewards for attending the event include exclusive merchandise and discounts on future events. For more information, visit our website at https://example.com/concert or contact us at https://example.com/contact")}>Check Ai</button>
      <CardGrid search={search}/>
    </div>
  )
}

export default CardWithSearch