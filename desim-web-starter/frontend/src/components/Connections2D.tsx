import { useModelStore } from '../store/useModelStore'

export function Connections2D(){
  const { nodes, links } = useModelStore()
  const getPos = (id:string)=>{ const n=nodes.find(n=>n.id===id); return n? {x: n.x*40+window.innerWidth/2, y: -n.y*40+200}: {x:0,y:0} }
  return (
    <svg style={{position:'absolute', inset:0, pointerEvents:'none'}}>
      {links.map((l,i)=>{ const a=getPos(l.from), b=getPos(l.to); return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#8ab4f8" markerEnd='url(#arrow)'/> })}
      <defs><marker id='arrow' viewBox='0 0 10 10' refX='10' refY='5' markerWidth='6' markerHeight='6' orient='auto-start-reverse'><path d='M 0 0 L 10 5 L 0 10 z' fill='#8ab4f8'/></marker></defs>
    </svg>
  )
}
