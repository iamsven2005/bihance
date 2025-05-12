"use client"

import { useEffect, useState } from "react"

export default function SearchBoard() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => setResults(data))
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [query])

  // Fetch all boards on first load (no search yet)
  useEffect(() => {
    fetch("/api/search")
      .then((res) => res.json())
      .then((data) => setResults(data))
  }, [])

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="p-2 border rounded w-full mb-4"
      />
      <ul>
        {results.map((item) => (
          <li key={item.id} className="mb-2">
            <strong>{item.id}</strong> | {item.one} | {item.two} | {item.three}
          </li>
        ))}
      </ul>
    </div>
  )
}
