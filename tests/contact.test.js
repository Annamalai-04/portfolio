import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { MongoClient } from 'mongodb';
import { validateContact, submitContact } from '../server/contact.js';
import { createApp } from '../server/app.js';
const input={reason:'Wanted to hire you',mobile:'98765 43210',whatsapp:true};
test('normalizes Indian numbers and preserves international numbers',()=>{
 assert.equal(validateContact(input).mobile,'+919876543210');
 assert.equal(validateContact({...input,mobile:'+1 (202) 555-0123'}).mobile,'+12025550123');
});
test('rejects invalid reasons, numbers and nonboolean WhatsApp flags',()=>{
 for(const change of [{reason:'bad'},{mobile:'abc'},{mobile:'123'},{whatsapp:'yes'}])assert.throws(()=>validateContact({...input,...change}));
});
test('saves only permitted fields and constructs the owner WhatsApp link',async()=>{
 let record;const result=await submitContact({...input,name:'ignored'},{insertOne:async value=>{record=value;}});
 assert.equal(record.name,undefined);assert.equal(record.mobile,'+919876543210');assert.ok(record.createdAt instanceof Date);
 assert.equal(result.saved,true);assert.ok(result.whatsappUrl.startsWith('https://wa.me/917339339065?text='));
 assert.match(decodeURIComponent(result.whatsappUrl),/Wanted to hire you/);
});
test('non-WhatsApp requests are stored without a chat link',async()=>{
 const result=await submitContact({...input,whatsapp:false},{insertOne:async()=>{}});assert.equal(result.whatsappUrl,null);
});
test('database failure cannot report success',async()=>{
 await assert.rejects(()=>submitContact(input,{insertOne:async()=>{throw Error('offline')}}));
});
test('HTTP endpoint validates requests and returns database failure honestly',async t=>{
 const app=createApp({collection:{insertOne:async()=>{throw Error('offline')}}});app.listen(0,'127.0.0.1');await once(app,'listening');t.after(()=>new Promise(resolve=>app.close(resolve)));
 const url=`http://127.0.0.1:${app.address().port}/api/contact`;
 const send=body=>fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
 assert.equal((await send({...input,mobile:'bad'})).status,400);
 assert.equal((await send(input)).status,503);
 assert.equal((await fetch(url,{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://wrong.example'},body:JSON.stringify(input)})).status,403);
});
test('live MongoDB: HTTP submission persists to myportfolio.responses', {skip:process.env.TEST_MONGODB!=='1'}, async t=>{
 const client=new MongoClient(process.env.MONGODB_URI||'mongodb://127.0.0.1:27017',{serverSelectionTimeoutMS:5000});await client.connect();
 const collection=client.db('myportfolio').collection('responses');let insertedId;
 const app=createApp({collection:{insertOne:async value=>{const result=await collection.insertOne(value);insertedId=result.insertedId;return result}}});
 t.after(async()=>{await new Promise(resolve=>app.close(resolve));if(insertedId)await collection.deleteOne({_id:insertedId});await client.close()});
 app.listen(0,'127.0.0.1');await once(app,'listening');
 const response=await fetch(`http://127.0.0.1:${app.address().port}/api/contact`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({reason:'others',mobile:'+12025550123',whatsapp:false})});
 assert.equal(response.status,201);assert.equal((await response.json()).saved,true);
 const saved=await collection.findOne({_id:insertedId});assert.equal(saved.mobile,'+12025550123');assert.equal(saved.reason,'others');assert.equal(saved.status,'new');
});
