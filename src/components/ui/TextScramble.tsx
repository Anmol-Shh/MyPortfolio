import { useEffect, useRef, useState } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&'

interface TextScrambleProps {
  texts: string[]
  interval?: number   // ms between word switches
  scrambleDuration?: number // ms for scramble animation
  className?: string
}

/**
 * Cycles through an array of strings with a character-scramble reveal effect.
 */
export function TextScramble({
  texts,
  interval = 2800,
  scrambleDuration = 600,
  className = '',
}: TextScrambleProps) {
  const [displayed, setDisplayed] = useState(texts[0])
  const indexRef = useRef(0)
  const frameRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const scrambleTo = (target: string) => {
      const totalFrames = Math.floor(scrambleDuration / 30)
      let frame = 0

      const tick = () => {
        const progress = frame / totalFrames
        const result = target
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' '
            if (i / target.length < progress) return char
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          })
          .join('')

        setDisplayed(result)
        frame++

        if (frame <= totalFrames) {
          frameRef.current = setTimeout(tick, 30)
        } else {
          setDisplayed(target)
        }
      }

      tick()
    }

    const cycle = () => {
      indexRef.current = (indexRef.current + 1) % texts.length
      scrambleTo(texts[indexRef.current])
    }

    const id = setInterval(cycle, interval)
    return () => {
      clearInterval(id)
      if (frameRef.current) clearTimeout(frameRef.current)
    }
  }, [texts, interval, scrambleDuration])

  return (
    <span className={className} aria-label={texts[indexRef.current]}>
      {displayed}
    </span>
  )
}
