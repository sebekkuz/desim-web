import { useModelStore } from '../store/useModelStore'

const items = [
  { type:'EntityGenerator', color:'#2e7d32' },
  { type:'Queue', color:'#1565c0' },
  { type:'Server', color:'#ef6c00' },
  { type:'EntitySink', color:'#6d4c41' }
] as const

export function Palette(){
  const addNode = useModelStore(s=>s.addNode)
  return (
    <div style={{padding:8}}>
      <h3>Model Builder</h3>
      {items.map(i=> (
        <button key={i.type} onClick={()=> addNode({ id: `${i.type}-${Date.now()%1e5}`, type:i.type as any, x: Math.random()*4-2, y: Math.random()*4-2, color:i.color })}>
          + {i.type}
        </button>
      ))}
    </div>
  )
}
