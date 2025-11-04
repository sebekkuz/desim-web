import YAML from 'yaml';
import { ModelSchema } from '../../../shared/protocol.js';
import { EntityGenerator } from '../sim/components/EntityGenerator.js';
import { Queue } from '../sim/components/Queue.js';
import { Server } from '../sim/components/Server.js';
import { EntitySink } from '../sim/components/EntitySink.js';

const registry = { EntityGenerator, Queue, Server, EntitySink };

export function loadModelFromText(text){
  const obj = (text.trim().startsWith('{')? JSON.parse(text) : YAML.parse(text));
  return ModelSchema.parse(obj);
}

export function buildEngine(engine, model){
  for(const [id,def] of Object.entries(model.define)){
    const Ctor = registry[def.type]; if(!Ctor) throw new Error(`Unknown type ${def.type}`);
    engine.addComponent(id, new Ctor(def.inputs||{}));
  }
  for(const l of model.links){ engine.connect(l.from, l.to); }
}
