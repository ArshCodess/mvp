"use client"
import CardGrid from "@/components/CardGrid"
import { useState } from "react"

function CardWithSearch() {
  const [search, setSearch] = useState('')
  return (
    <div className="">
      <input type="text" onChange={(e) => setSearch(e.target.value)} placeholder="Search events..." className="w-full p-2 border rounded mb-4" />
      <CardGrid search={search}/>
    </div>
  )
}

export default CardWithSearch