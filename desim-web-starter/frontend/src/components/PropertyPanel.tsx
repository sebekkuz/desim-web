import { useModelStore } from '../store/useModelStore'

export function PropertyPanel(){
  const { nodes, selectedId, setColor } = useModelStore()
  const n = nodes.find(n=>n.id===selectedId)
  if(!n) return <div style={{padding:8}}><h3>Inspector</h3><p>Wybierz obiekt…</p></div>
  return (
    <div style={{padding:8}}>
      <h3>Inspector</h3>
      <div>ID: {n.id}</div>
      <div>Typ: {n.type}</div>
      <label>Kolor: <input type='color' value={n.color} onChange={e=> setColor(n.id, e.target.value)}/></label>
    </div>
  )
}
