import { useEffect, useState } from 'react'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './components/ui/resizable'
import { webSocket } from 'rxjs/webSocket'
import { Subject } from 'rxjs';

interface SvgFile {
  content: String
}


function App() {



  const [svg, setSvg] = useState<String>("")

  useEffect(() => {
    const socket$ = webSocket<SvgFile>("ws://localhost:2195");
    const subscription = socket$.subscribe({

      next: (msg: SvgFile) => {


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
        <ResizablePanel>
          Folder picker - to be implemented
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <div dangerouslySetInnerHTML={{ __html: svg }} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  )
}

export default App
