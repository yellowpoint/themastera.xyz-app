import * as React from 'react'

type Props = React.SVGProps<SVGSVGElement> & { size?: number | string }

export function GoogleIcon({ size = 18, ...props }: Props) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 48 48" {...props}>
      <path fill="#FFC107" d="M43.6 20.5h-1.9v-.1H24v7.2h11.3C33.8 31.8 29.5 35 24 35c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.3 0 6.3 1.2 8.6 3.2l5.1-5.1C34.8 3.8 29.7 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 20-9 20-20 0-1.3-.1-2.2-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l5.9 4.3c1.6-4 5.6-6.8 10.1-6.8 3.3 0 6.3 1.2 8.6 3.2l5.1-5.1C34.8 3.8 29.7 2 24 2 15.5 2 8.4 6.7 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 46c5.4 0 10.5-2.1 14.3-5.7l-6.6-5.4c-2.1 1.5-4.8 2.3-7.7 2.3-5.5 0-10.2-3.2-12.3-7.8l-6.7 5.1C7.1 41.2 15 46 24 46z"/>
      <path fill="#1976D2" d="M43.6 20.5h-1.9v-.1H24v7.2h11.3c-1.2 3.6-4 6.3-7.6 7.6l6.6 5.4c3.8-3.5 6.4-8.7 6.4-14.6 0-1.3-.1-2.2-.4-3.5z"/>
    </svg>
  )
}

export default GoogleIcon