import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip } from 'chart.js'
import { useEffect, useRef, useState } from 'react'

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip)

export function OutputPanel(){
  const [data, setData] = useState<{t:number,v:number}[]>([])
  const wsRef = useRef<WebSocket|null>(null)
  useEffect(()=>{
    const ws = new WebSocket(import.meta.env.VITE_BACKEND_WS_URL || 'ws://localhost:3001/ws')
    wsRef.current = ws
    ws.onmessage = (ev)=>{ const msg = JSON.parse(ev.data); if(msg.type==='METRIC'){ const pts = msg.series.filter((s:any)=> s.name.endsWith('.len')).map((s:any)=> ({t:s.t,v:s.v})) ; if(pts.length) setData(d=>[...d, ...pts]) } }
    return ()=> ws.close()
  },[])
  return (
    <div style={{padding:8}}>
      <h3>Wyniki</h3>
      <Line data={{ labels: data.map(p=>p.t.toFixed(2)), datasets:[{ label:'Q.len', data: data.map(p=>p.v) }] }} />
    </div>
  )
}
