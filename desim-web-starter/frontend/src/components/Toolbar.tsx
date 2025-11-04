import { useModelStore } from '../store/useModelStore'

const HTTP_URL = import.meta.env.VITE_BACKEND_HTTP_URL || 'http://localhost:3001'

export function Toolbar({ wsRef }:{ wsRef: React.MutableRefObject<WebSocket|null> }){
  const { simTime, running } = useModelStore()
  const call = (p:string)=> fetch(`${HTTP_URL}/api/${p}`, { method:'POST' })
  return (
    <div style={{display:'flex', gap:8, alignItems:'center', padding:8, background:'#121826', color:'#cbd5e1'}}>
      <button onClick={()=> call('start')}>▶ Start</button>
      <button onClick={()=> call('pause')}>⏸ Pauza</button>
      <button onClick={()=> call('reset')}>⟲ Reset</button>
      <div style={{marginLeft:'auto'}}>t = {simTime.toFixed(2)} s {running? ' (RUN)': ' (STOP)'}</div>
    </div>
  )
}
