import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from './app.mjs';
async function withServer(options, run) {
 const server = createApp(options).listen(0, '127.0.0.1');
 await new Promise(resolve => server.once('listening', resolve));
 try { await run(async body => fetch(`http://127.0.0.1:${server.address().port}/api/interest`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})); }
 finally { await new Promise(resolve => server.close(resolve)); }
}
test('valid submission goes only to company address with visitor reply-to', async () => {
 let mail;
 await withServer({from:'verified@example.com',transporter:{sendMail:async value => {mail=value;return {accepted:['info@tovision.sa']};}}}, async post => {
  assert.equal((await post({email:'visitor@example.com',to:'attacker@example.com'})).status,200);
  assert.equal(mail.to,'info@tovision.sa');assert.equal(mail.replyTo,'visitor@example.com');assert.match(mail.text,/visitor@example.com/);
 });
});
test('invalid input and bot submissions never send', async () => {
 let count=0;
 await withServer({from:'verified@example.com',transporter:{sendMail:async()=>{count++;}}},async post=>{
  for(const email of ['invalid','hello@example.com\r\nBcc: other@example.com']) assert.equal((await post({email})).status,400);
  assert.equal((await post({email:'visitor@example.com',website:'bot'})).status,400);assert.equal(count,0);
 });
});
test('missing SMTP configuration returns unavailable',async()=>withServer({},async post=>assert.equal((await post({email:'visitor@example.com'})).status,503)));
test('SMTP failure returns failure, not success',async()=>withServer({from:'verified@example.com',transporter:{sendMail:async()=>{throw Error('SMTP down');}}},async post=>assert.equal((await post({email:'visitor@example.com'})).status,502)));
test('unaccepted recipient returns failure',async()=>withServer({from:'verified@example.com',transporter:{sendMail:async()=>({accepted:[]})}},async post=>assert.equal((await post({email:'visitor@example.com'})).status,502)));
test('request limit blocks sixth attempt',async()=>withServer({},async post=>{for(let i=0;i<5;i++) await post({email:'visitor@example.com'});assert.equal((await post({email:'visitor@example.com'})).status,429);}));
