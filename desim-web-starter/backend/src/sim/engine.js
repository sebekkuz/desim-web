import { EventQueue } from './eventQueue.js';
import { v4 as uuid } from 'uuid';

export class Engine {
  constructor({ onEvent, onMetric }={}){
    this.eq = new EventQueue();
    this.now = 0; this.running = false; this.onEvent = onEvent; this.onMetric = onMetric;
    this.components = new Map(); this.links = []; this.entities = new Map();
  }
  getSimTime(){ return this.now; }
  start(){ if(this.running) return; this.running = true; this.loop(); }
  pause(){ this.running = false; }
  reset(){ this.eq = new EventQueue(); this.now=0; this.entities.clear(); for(const c of this.components.values()) c.reset?.(); }
  scheduleProcess(delay, fn){ this.eq.push(this.now+delay, fn); }
  waitUntil(pred, cb){ const trySchedule = () => { if(pred()) cb(); else this.scheduleProcess(0.001, trySchedule); }; trySchedule(); }
  killProcess(/*handle*/){ /* no-op in minimal impl */ }
  interruptProcess(/*handle*/){ /* optional */ }

  addComponent(id, comp){ this.components.set(id, comp); comp._attach(this, id); }
  connect(from, to){ this.links.push({ from, to }); }
  nextOf(id){ return this.links.filter(l=>l.from===id).map(l=>l.to); }

  createEntity(type='Entity'){ const id = uuid(); const e = { id, type, createdAt: this.now }; this.entities.set(id, e); return e; }
  moveEntity(e, from, to){ this.onEvent?.({ type:'ENTITY_MOVE', id:e.id, from, to, at:this.now }); }

  loop(){ const tick = () => {
      if(!this.running) return; const ev = this.eq.pop(); if(!ev){ this.running=false; return; }
      this.now = ev.t; ev.fn(); this.onMetric?.(this.snapshotMetrics()); setImmediate(tick);
    }; tick(); }

  snapshotMetrics(){ // simple example
    const s = []; for(const [id,comp] of this.components){ if(comp.metric) s.push({ name:`${id}.${comp.metric.name}`, t:this.now, v:comp.metric.value() }); }
    return s;
  }
}
