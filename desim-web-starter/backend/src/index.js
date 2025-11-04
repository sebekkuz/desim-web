import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { Engine } from './sim/engine.js';
import { buildEngine, loadModelFromText } from './model/loader.js';

const app = express();
app.use(cors());
app.use(express.json({ limit:'2mb' }));

let engine = new Engine({
  onEvent: (ev)=> broadcast({ type:'ENTITY_MOVE', ...ev }),
  onMetric: (series)=> series.length && broadcast({ type:'METRIC', series })
});

function broadcast(msg){ for(const ws of wss.clients){ if(ws.readyState===1) ws.send(JSON.stringify(msg)); } }

app.get('/api/health', (_,res)=> res.json({ ok:true }));
app.post('/api/load', (req,res)=>{
  try{
    const model = loadModelFromText(JSON.stringify(req.body));
    engine.reset();
    engine = new Engine({ onEvent: (ev)=>broadcast({ type:'ENTITY_MOVE',...ev }), onMetric:(s)=> broadcast({ type:'METRIC', series:s }) });
    buildEngine(engine, model);
    return res.json({ ok:true });
  } catch(e){
    return res.status(400).json({ ok:false, error: String(e.message||e) });
  }
});
app.post('/api/start', (_,res)=>{ engine.start(); broadcast({ type:'STATE', simTime: engine.getSimTime(), running:true }); res.json({ ok:true }); });
app.post('/api/pause', (_,res)=>{ engine.pause(); broadcast({ type:'STATE', simTime: engine.getSimTime(), running:false }); res.json({ ok:true }); });
app.post('/api/reset', (_,res)=>{ engine.reset(); broadcast({ type:'STATE', simTime: 0, running:false }); res.json({ ok:true }); });

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, ()=> console.log(`API on :${PORT}`));

const wss = new WebSocketServer({ server, path:'/ws' });
wss.on('connection', (ws)=>{
  ws.send(JSON.stringify({ type:'HELLO', version:'0.1.0' }));
});
