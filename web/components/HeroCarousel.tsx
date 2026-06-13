'use client'

import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'

// Add photo URLs here as real school photos become available
const EXTRA_IMAGES: { src: string; alt: string }[] = []

interface HeroCarouselProps {
  cmsImages?: { src: string; alt: string }[]
}

export default function HeroCarousel({ cmsImages = [] }: HeroCarouselProps) {
  const images = [...cmsImages, ...EXTRA_IMAGES].filter((img) => Boolean(img.src))
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

  if (images.length === 0) {
    return (
      <div
        className="rounded-3xl flex flex-col items-center justify-center py-16 px-8 text-center"
        style={{
          background: '#FEF0F6',
          border: '2px dashed #E83D8F',
          minHeight: '320px',
        }}
      >
        <span style={{ fontSize: '80px', lineHeight: 1 }}>🎒</span>
        <p className="mt-5 text-base font-semibold" style={{ color: '#E83D8F' }}>
          School photos coming soon!
        </p>
      </div>
    )
  }

  return (
    <div
      className="relative rounded-3xl overflow-hidden"
      style={{ background: '#ffffff' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {images.map((img, i) => (
        <div
          key={img.src}
          className="transition-opacity duration-700"
          style={{
            position: i === current ? 'relative' : 'absolute',
            inset: i === current ? 'auto' : 0,
            width: '100%',
            opacity: i === current ? 1 : 0,
            pointerEvents: i === current ? 'auto' : 'none',
          }}
        >
          <Image
            src={img.src}
            alt={img.alt || `School photo ${i + 1}`}
            width={0}
            height={0}
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ width: '100%', height: 'auto', display: 'block' }}
            priority={i === 0}
          />
        </div>
      ))}

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl font-bold hover:opacity-100 opacity-80 transition-opacity"
            style={{ background: 'rgba(0,0,0,0.45)' }}
          >
            ‹
          </button>
          <button
            onClick={next}
            aria-label="Next photo"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl font-bold hover:opacity-100 opacity-80 transition-opacity"
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
