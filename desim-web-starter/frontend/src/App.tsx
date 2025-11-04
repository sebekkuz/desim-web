import { useEffect, useRef } from 'react'
import { Palette } from './components/Palette'
import { Canvas3D } from './components/Canvas3D'
import { Connections2D } from './components/Connections2D'
import { PropertyPanel } from './components/PropertyPanel'
import { OutputPanel } from './components/OutputPanel'
import { Toolbar } from './components/Toolbar'
import { startWs } from './lib/wsClient'

export default function App(){
  const wsRef = useRef<WebSocket|null>(null)
  useEffect(()=>{ wsRef.current = startWs(); return ()=> wsRef.current?.close() }, [])
  return (
    <div style={{display:'grid',gridTemplateColumns:'240px 1fr 320px', gridTemplateRows:'48px 1fr 240px', height:'100vh'}}>
      <div style={{gridColumn:'1/4'}}><Toolbar wsRef={wsRef}/></div>
      <div><Palette/></div>
      <div style={{position:'relative'}}>
        <Canvas3D/>
        <Connections2D/>
      </div>
      <div><PropertyPanel/></div>
      <div style={{gridColumn:'1/4'}}><OutputPanel/></div>
    </div>
  )
}
