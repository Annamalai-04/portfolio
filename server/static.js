import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.ico':'image/x-icon','.woff2':'font/woff2','.docx':'application/vnd.openxmlformats-officedocument.wordprocessingml.document'};
export function staticHandler(directory){
 const base=resolve(directory);
 return async(req,res)=>{
  if(req.method!=='GET'&&req.method!=='HEAD')return false;
  let path;try{path=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400);res.end();return true}
  const target=resolve(base,'.'+path);
  if(target!==base&&!target.startsWith(base+sep)){res.writeHead(403);res.end();return true}
  try{
   let file=target;let bytes;
   try{bytes=await readFile(file)}catch{if(extname(path))throw Error('missing');file=resolve(base,'index.html');bytes=await readFile(file)}
   res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':path.startsWith('/assets/')?'public, max-age=31536000, immutable':'no-cache'});
   res.end(req.method==='HEAD'?undefined:bytes);
  }catch{res.writeHead(404);res.end('Not found')}
  return true;
 }
}
