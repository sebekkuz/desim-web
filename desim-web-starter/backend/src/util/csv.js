export function toCSV(rows){
  if(!rows.length) return '';
  const keys=Object.keys(rows[0]);
  const head=keys.join(',');
  const lines=rows.map(r=> keys.map(k=>r[k]).join(','));
  return [head, ...lines].join('\n');
}
