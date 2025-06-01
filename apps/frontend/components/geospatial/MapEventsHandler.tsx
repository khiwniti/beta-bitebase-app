'use client'

import { useMapEvents } from 'react-leaflet'

interface MapEventsHandlerProps {
  onClick?: (e: any) => void
}

export default function MapEventsHandler({ onClick }: MapEventsHandlerProps) {
  useMapEvents({
    click: (e) => {
      if (onClick) {
        onClick({
          latlng: e.latlng,
          lat: e.latlng.lat,
          lng: e.latlng.lng
        })
      }
    }
  })
  return null
}
