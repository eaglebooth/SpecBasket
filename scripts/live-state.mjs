export function freezeArguments(events,label,basketId,currentRevision,ids){
 const existing=events.find(e=>e.event==='intent'&&e.label===label)?.input.args;
 const selection=JSON.stringify(ids);
 if(existing){
  if(existing[0]!==basketId||existing[2]!==selection)throw Error('Resume freeze selection mismatch');
  return existing;
 }
 return [basketId,currentRevision,selection];
}
