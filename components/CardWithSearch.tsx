"use client"
import CardGrid from "@/components/CardGrid"
import { useState } from "react"

function CardWithSearch() {
  const [search, setSearch] = useState('')
  return (
    <div className="space-y-4">
      <input 
        type="text" 
        onChange={(e) => setSearch(e.target.value)} 
        placeholder="Search events..." 
        className="w-full px-4 py-2 border md:mt-3 mt-2 lg:mt-4 border-gray-300 rounded-lg focus:outline-none focus:ring-0 "
      />
      <CardGrid search={search}/>
    </div>
  )
}

export default CardWithSearch