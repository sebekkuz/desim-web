export class Server {
  constructor({ ServiceTime }){ this.ServiceTime = ServiceTime; this.busy=false; this.metric={ name:'busy', value:()=>this.busy?1:0 }; }
  _attach(engine,id){ this.engine=engine; this.id=id; }
  reset(){ this.busy=false; }
  _sample(x){ if(typeof x==='number') return x; if(x?.dist){ const d=x.dist; if(d.type==='Exponential') return -Math.log(1-Math.random())*d.mean; if(d.type==='Uniform') return d.min + Math.random()*(d.max-d.min); if(d.type==='Triangular'){ const {min,mode,max}=d; const u=Math.random(); const c=(mode-min)/(max-min); return u<c? min+Math.sqrt(u*(max-min)*(mode-min)) : max - Math.sqrt((1-u)*(max-min)*(max-mode)); } }
    return Number(x)||0; }
  onQueueUpdated(){ if(!this.busy){ this._tryStart(); } }
  onEntity(e, from){ if(!this.busy) this._start(e, from); else { /* usually entity comes via queue */ } }
  _tryStart(){ const qLink = this.engine.links.find(l=>l.to===this.id);
    if(!qLink) return;
    const q = this.engine.components.get(qLink.from);
    if(q && q.items?.length){ const e=q.pop(); this._start(e, q.id); }
  }
  _start(e, from){ this.busy=true; const dt=this._sample(this.ServiceTime)||1; this.engine.moveEntity(e, from, this.id);
    this.engine.scheduleProcess(dt, ()=>{
      this.busy=false;
      for(const to of this.engine.nextOf(this.id)){
        this.engine.components.get(to).onEntity(e, this.id);
      }
      this._tryStart();
    });
  }
}
