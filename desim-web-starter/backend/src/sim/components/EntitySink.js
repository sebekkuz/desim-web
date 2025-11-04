export class EntitySink {
  constructor(){ this.count=0; this.metric={ name:'count', value:()=>this.count }; }
  _attach(engine,id){ this.engine=engine; this.id=id; }
  reset(){ this.count=0; }
  onEntity(e, from){ this.engine.moveEntity(e, from, this.id); this.count++; }
}
