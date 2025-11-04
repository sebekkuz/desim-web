import { create } from 'zustand'

export type NodeType = 'EntityGenerator'|'Queue'|'Server'|'EntitySink'
export interface Node { id:string; type:NodeType; x:number; y:number; color:string; }
export interface Link { from:string; to:string }

interface State {
  nodes: Node[]
  links: Link[]
  selectedId?: string
  simTime: number
  running: boolean
  addNode: (n:Node)=>void
  addLink: (l:Link)=>void
  setColor: (id:string, color:string)=>void
  setSelected: (id?:string)=>void
  setSim: (t:number, running:boolean)=>void
}

export const useModelStore = create<State>((set)=>({
  nodes: [], links: [], running:false, simTime:0,
  addNode: (n)=> set(s=>({ nodes:[...s.nodes,n] })),
  addLink: (l)=> set(s=>({ links:[...s.links,l] })),
  setColor:(id,color)=> set(s=>({ nodes:s.nodes.map(n=> n.id===id? {...n,color}:n) })),
  setSelected:(id)=> set({ selectedId:id }),
  setSim:(t,running)=> set({ simTime:t, running })
}))
