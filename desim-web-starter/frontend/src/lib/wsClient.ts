import { useModelStore } from '../store/useModelStore'

const WS_URL = import.meta.env.VITE_BACKEND_WS_URL || 'ws://localhost:3001/ws'

export function startWs(){
  const ws = new WebSocket(WS_URL)
  ws.onmessage = (ev)=>{
    const msg = JSON.parse(ev.data)
    if(msg.type==='STATE') useModelStore.getState().setSim(msg.simTime, msg.running)
    if(msg.type==='ENTITY_MOVE'){ /* hook for animations */ }
  }
  return ws
}
