import { useState, useEffect, useRef } from 'react'
import { PERFORMANCE_BUDGET } from '../lib/animations'

/**
 * Performance metrics tracked by the monitor.
 */
export interface PerformanceMetrics {
  /**
   * Current frames per second (target: 60fps)
   */
  fps: number
  
  /**
   * Average time per frame in milliseconds (target: <16.67ms for 60fps)
   */
  frameTime: number
  
  /**
   * Number of active animations being tracked
   */
  animationCount: number
  
  /**
   * Whether performance is within acceptable bounds
   */
  isPerformant: boolean
}

/**
 * Options for configuring performance monitoring.
 */
export interface PerformanceMonitorOptions {
  /**
   * How often to update FPS measurements in milliseconds
   * @default 1000
   */
  updateInterval?: number
  
  /**
   * Minimum acceptable FPS before flagging performance issues
   * @default 30
   */
  minAcceptableFPS?: number
  
  /**
   * Whether to log performance warnings to console
   * @default false
   */
  logWarnings?: boolean
}

/**
 * Hook to monitor animation performance and track FPS.
 * Helps ensure animations maintain 60fps target and stay within performance budget.
 * 
 * @param {PerformanceMonitorOptions} options - Configuration options
 * @returns {PerformanceMetrics} - Current performance metrics
 * 
 * @example
 * ```tsx
 * function AnimatedComponent() {
 *   const { fps, frameTime, isPerformant } = usePerformanceMonitor({
 *     logWarnings: true,
 *     minAcceptableFPS: 30
 *   })
 *   
 *   // Reduce animation complexity if performance is poor
 *   const particleCount = isPerformant ? 100 : 50
 *   
 *   return (
 *     <div>
 *       <ParticleSystem count={particleCount} />
 *       {process.env.NODE_ENV === 'development' && (
 *         <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 text-xs">
 *           FPS: {fps} | Frame Time: {frameTime.toFixed(2)}ms
 *         </div>
 *       )}
 *     </div>
 *   )
 * }
 * ```
 */
export function usePerformanceMonitor(
  options: PerformanceMonitorOptions = {}
): PerformanceMetrics {
  const {
    updateInterval = 1000,
    minAcceptableFPS = 30,
    logWarnings = false,
  } = options

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: PERFORMANCE_BUDGET.targetFPS,
    frameTime: PERFORMANCE_BUDGET.maxFrameTime,
    animationCount: 0,
    isPerformant: true,
  })

  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const rafIdRef = useRef<number | null>(null)
  const hasLoggedWarningRef = useRef(false)

  useEffect(() => {
    let frameCount = 0
    let lastTime = performance.now()

    const measureFPS = (currentTime: number) => {
      frameCount++
      const delta = currentTime - lastTime

      // Update metrics at specified interval
      if (delta >= updateInterval) {
        const fps = Math.round((frameCount * 1000) / delta)
        const frameTime = delta / frameCount
        const isPerformant = fps >= minAcceptableFPS && frameTime <= PERFORMANCE_BUDGET.maxFrameTime * 1.2

        setMetrics((prev) => ({
          ...prev,
          fps,
          frameTime,
          isPerformant,
        }))

        // Log performance warnings in development
        if (logWarnings && !isPerformant && !hasLoggedWarningRef.current) {
          console.warn(
            `[Performance Monitor] Performance degradation detected:\n` +
            `  FPS: ${fps} (target: ${PERFORMANCE_BUDGET.targetFPS})\n` +
            `  Frame Time: ${frameTime.toFixed(2)}ms (budget: ${PERFORMANCE_BUDGET.maxFrameTime}ms)\n` +
            `  Consider reducing animation complexity or particle count.`
          )
          hasLoggedWarningRef.current = true
        } else if (isPerformant && hasLoggedWarningRef.current) {
          // Reset warning flag when performance recovers
          hasLoggedWarningRef.current = false
        }

        // Reset counters
        frameCount = 0
        lastTime = currentTime
      }

      rafIdRef.current = requestAnimationFrame(measureFPS)
    }

    // Start monitoring
    rafIdRef.current = requestAnimationFrame(measureFPS)

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [updateInterval, minAcceptableFPS, logWarnings])

  return metrics
}

/**
 * Utility function to check if device meets minimum performance requirements.
 * Based on device memory and hardware concurrency.
 * 
 * @returns {boolean} True if device likely meets 4GB RAM requirement
 */
export function meetsPerformanceRequirements(): boolean {
  // Check if performance API is available
  if (typeof navigator === 'undefined') {
    return true // Assume capable on server-side
  }

  // Check device memory (if available)
  // @ts-expect-error - deviceMemory is not in standard types yet
  const deviceMemory = navigator.deviceMemory as number | undefined
  if (deviceMemory !== undefined) {
    return deviceMemory >= 4 // 4GB minimum
  }

  // Fallback: check hardware concurrency (CPU cores)
  const hardwareConcurrency = navigator.hardwareConcurrency
  if (hardwareConcurrency !== undefined) {
    return hardwareConcurrency >= 4 // Assume 4+ cores = capable device
  }

  // Default to true if we can't determine
  return true
}
