import { ImageResponse } from 'next/og'

export const alt = 'Tiny Thinkers Learning Center: play-based learning in Quezon City'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 80, background: '#FFF5FB', color: '#1C2B4A' }}>
      <div style={{ display: 'flex', fontSize: 30, color: '#009688', marginBottom: 24 }}>QUEZON CITY · PHILIPPINES</div>
      <div style={{ display: 'flex', fontSize: 76, fontWeight: 700 }}>Tiny Thinkers</div>
      <div style={{ display: 'flex', fontSize: 48, marginBottom: 36 }}>Learning Center</div>
      <div style={{ display: 'flex', fontSize: 32, color: '#E83D8F' }}>Curiosity, creativity and confidence through play.</div>
      <div style={{ display: 'flex', fontSize: 24, marginTop: 36 }}>www.tinythinkers.edu.ph</div>
    </div>, size
  )
}
