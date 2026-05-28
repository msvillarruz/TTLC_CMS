import React from 'react'

export const metadata = {
  description: 'Tiny Thinkers Learning Center CMS',
  title: 'TTLC CMS',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
