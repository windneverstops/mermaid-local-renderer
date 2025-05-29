import { useEffect, useState } from 'react'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './components/ui/resizable'
import { webSocket } from 'rxjs/webSocket'
import { Subject } from 'rxjs';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

interface SvgFile {
  content: string
}

function App() {
  const [svg, setSvg] = useState<string>("")

  useEffect(() => {
    const socket$ = webSocket<SvgFile>("ws://localhost:2195");
    const subscription = socket$.subscribe({

      next: (msg: SvgFile) => {

        console.log(msg.content)
        setSvg(msg.content)
      },
      error: () => { },
      complete: () => { }
    });
    return () => subscription.unsubscribe();
  }, []);
  return (
    <>
      <ResizablePanelGroup direction='horizontal'>
        <ResizablePanel defaultSize={10}>
          Folder picker - to be implemented
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={90}>
          <div className='h-screen'>
            <TransformWrapper centerOnInit initialScale={2}>
              <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
                <div dangerouslySetInnerHTML={{ __html: svg }} className='h-full w-full' />
              </TransformComponent>
            </TransformWrapper>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  )
}

export default App
