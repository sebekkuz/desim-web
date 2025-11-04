export class EventQueue {
  constructor() { this.h = []; this.seq = 0; }
  push(t, fn) { this.h.push({ t, seq: this.seq++, fn }); this._up(this.h.length-1); }
  pop() { if(!this.h.length) return null; const top = this.h[0]; const last = this.h.pop(); if(this.h.length){ this.h[0]=last; this._down(0);} return top; }
  peekTime(){ return this.h.length ? this.h[0].t : Infinity; }
  _up(i){ while(i){ const p=(i-1>>1); if(this._less(i,p)){ [this.h[i],this.h[p]]=[this.h[p],this.h[i]]; i=p;} else break; } }
  _down(i){ for(;;){ let l=i*2+1, r=l+1, m=i; if(l<this.h.length && this._less(l,m)) m=l; if(r<this.h.length && this._less(r,m)) m=r; if(m!==i){ [this.h[i],this.h[m]]=[this.h[m],this.h[i]]; i=m; } else break; } }
  _less(i,j){ const a=this.h[i], b=this.h[j]; return a.t<b.t || (a.t===b.t && a.seq<b.seq); }
}
