export class Queue {
  constructor({ Capacity=Infinity }){ this.Capacity = Capacity; this.items=[]; this.metric={ name:'len', value:()=>this.items.length }; }
  _attach(engine,id){ this.engine=engine; this.id=id; }
  reset(){ this.items.length=0; }
  onEntity(e, from){ if(this.items.length < this.Capacity){ this.items.push(e); this._tryServe(); } }
  pop(){ return this.items.shift(); }
  _tryServe(){ // find connected servers and poke them
    for(const to of this.engine.nextOf(this.id)){ const c=this.engine.components.get(to); if(c?.onQueueUpdated) c.onQueueUpdated(); }
  }
}
