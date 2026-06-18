'use client'

import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'

interface EventCarouselProps {
  images: { url: string; alt?: string }[]
}

export default function EventCarousel({ images }: EventCarouselProps) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % images.length),
    [images.length],
  )

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length)

  useEffect(() => {
    if (paused || images.length <= 1) return
    const timer = setInterval(next, 4000)
    return () => clearInterval(timer)
  }, [paused, next, images.length])

  if (images.length === 0) return null

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{ background: '#ffffff', border: '1px solid #e5e7eb' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
        {images.map((img, i) => (
          <div
            key={img.url}
            className="transition-opacity duration-700"
            style={{
              position: 'absolute',
              inset: 0,
              opacity: i === current ? 1 : 0,
              pointerEvents: i === current ? 'auto' : 'none',
            }}
          >
            <Image
              src={img.url}
              alt={img.alt || `Event photo ${i + 1}`}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 768px"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl font-bold opacity-80 hover:opacity-100 transition-opacity"
            style={{ background: 'rgba(0,0,0,0.45)' }}
          >
            ‹
          </button>
          <button
            onClick={next}
            aria-label="Next photo"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl font-bold opacity-80 hover:opacity-100 transition-opacity"
            style={{ background: 'rgba(0,0,0,0.45)' }}
          >
            ›
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to photo ${i + 1}`}
                className="w-2.5 h-2.5 rounded-full border-2 border-white transition-colors"
                style={{ background: i === current ? '#fff' : 'transparent' }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
