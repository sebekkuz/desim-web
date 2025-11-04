export class EntityGenerator {
  constructor({ InterarrivalTime, EntityType='Entity' }){ this.InterarrivalTime = InterarrivalTime; this.EntityType = EntityType; }
  _attach(engine, id){ this.engine=engine; this.id=id; this.reset(); }
  reset(){ this._scheduleNext(); }
  _sample(x){ if(typeof x==='number') return x; if(x?.dist){ const d=x.dist; if(d.type==='Exponential') return -Math.log(1-Math.random())*d.mean; if(d.type==='Uniform') return d.min + Math.random()*(d.max-d.min); if(d.type==='Triangular'){ const {min,mode,max}=d; const u=Math.random(); const c=(mode-min)/(max-min); return u<c? min+Math.sqrt(u*(max-min)*(mode-min)) : max - Math.sqrt((1-u)*(max-min)*(max-mode)); } }
    return Number(x)||0; }
  _scheduleNext(){ const dt=this._sample(this.InterarrivalTime)||1; this.engine.scheduleProcess(dt, ()=>{ const e=this.engine.createEntity(this.EntityType); for(const to of this.engine.nextOf(this.id)){ this.engine.components.get(to).onEntity(e, this.id); } this._scheduleNext(); }); }
}
