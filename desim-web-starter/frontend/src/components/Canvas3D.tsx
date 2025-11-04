import { Canvas } from '@react-three/fiber'
import { useModelStore } from '../store/useModelStore'

function NodeBox({ id, color, x, y }:{ id:string;color:string;x:number;y:number }){
  const setSelected = useModelStore(s=>s.setSelected)
  return (
    <mesh position={[x, y, 0]} onClick={()=> setSelected(id)}>
      <boxGeometry args={[0.8,0.5,0.3]}/>
      <meshStandardMaterial color={color}/>
    </mesh>
  )
}

export function Canvas3D(){
  const nodes = useModelStore(s=>s.nodes)
  return (
    <Canvas style={{background:'#0b1020'}} camera={{ position:[0,0,8] }}>
      <ambientLight intensity={0.6}/>
      <directionalLight position={[5,5,5]} />
      {nodes.map(n=> <NodeBox key={n.id} id={n.id} color={n.color} x={n.x} y={n.y}/>) }
    </Canvas>
  )
}
