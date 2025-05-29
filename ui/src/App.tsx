import { useEffect, useRef, useState } from 'react'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './components/ui/resizable'
import { webSocket } from 'rxjs/webSocket'
import { SvgPanZoomInstance, default as svgPanZoom } from 'svg-pan-zoom'

interface SvgFile {
  content: string
}

function App() {
  const [svg, setSvg] = useState<string>("")
  const svgContainerRef = useRef<HTMLDivElement>(null)
  const panZoomRef = useRef<SvgPanZoomInstance | null>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)

  useEffect(() => {
    const socket$ = webSocket<SvgFile>("ws://localhost:2195")
    const subscription = socket$.subscribe({
      next: (msg: SvgFile) => {
        setSvg(msg.content.replace(/<svg([^>]*)>/, '<svg$1 width="100%" height="100%">'))
      },
      error: () => { },
      complete: () => { }
    })
    return () => subscription.unsubscribe()
  }, [])

  // Initialize ResizeObserver once on mount
  useEffect(() => {
    if (!svgContainerRef.current) return

    resizeObserverRef.current = new ResizeObserver(() => {
      if (panZoomRef.current) {
        panZoomRef.current.resize()
        panZoomRef.current.fit()
        panZoomRef.current.center()
      }
    })

    resizeObserverRef.current.observe(svgContainerRef.current)

    return () => {
      if (resizeObserverRef.current && svgContainerRef.current) {
        resizeObserverRef.current.unobserve(svgContainerRef.current)
      }
      resizeObserverRef.current = null
    }
  }, [])

  // Initialize or update panZoom instance on svg change
  useEffect(() => {
    if (!svgContainerRef.current) return
    const svgEl = svgContainerRef.current.querySelector('svg')
    if (!svgEl) return

    svgEl.style.width = '100%'
    svgEl.style.height = '100%'

    if (panZoomRef.current) panZoomRef.current.destroy()

    panZoomRef.current = svgPanZoom(svgEl, {
      zoomEnabled: true,
      controlIconsEnabled: true,
      fit: true,
      center: true,
      minZoom: 0.5,
      maxZoom: 20,
      zoomScaleSensitivity: 0.2,
    })
  }, [svg])

  return (
    <ResizablePanelGroup direction='horizontal'>
      <ResizablePanel defaultSize={10}>
        Folder picker - to be implemented
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={90} className="flex-1 h-screen">
        <div className="w-full h-full" ref={svgContainerRef} dangerouslySetInnerHTML={{ __html: svg }} />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export default App
