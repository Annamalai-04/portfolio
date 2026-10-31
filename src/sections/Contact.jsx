import { useState } from 'react';
import { ArrowUpRight, LoaderCircle, MessageCircle } from 'lucide-react';
import SocialLinks from '../components/SocialLinks';
import { personal } from '../data/personal';
import '../styles/contact-form.css';
const reasons=['Wanted to hire you','just need to talk with you','others'];
export default function Contact(){
 const [status,setStatus]=useState({type:'',message:'',whatsappUrl:null});
 async function submit(e){
  e.preventDefault();const form=e.currentTarget;const fields=new FormData(form);
  const payload={reason:fields.get('reason'),mobile:fields.get('mobile'),whatsapp:fields.get('whatsapp')==='on'};
  setStatus({type:'loading',message:'Saving your request…',whatsappUrl:null});
  try{
   const response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(15000)});
   const result=await response.json();
   if(!response.ok||result.saved!==true)throw new Error(result.message||'Your request could not be saved.');
   setStatus({type:'success',message:result.message,whatsappUrl:result.whatsappUrl});form.reset();
  }catch(error){setStatus({type:'error',message:error instanceof SyntaxError||error.name==='TypeError'?'Unable to reach the contact server. Please try again later.':error.name==='TimeoutError'?'The request timed out. Please try again.':error.message,whatsappUrl:null})}
 }
 return <section id="contact" className="section container"><div className="section-label">06 / START A CONVERSATION</div><div className="contact-layout"><div><h2>Have an idea?<br/>Let’s make<br/><em>it happen.</em><span className="contact-star">✳</span></h2><p>Looking to hire, discuss an opportunity,<br/>or just have a conversation? Leave your number.</p><SocialLinks/><a className="contact-email" href={`mailto:${personal.email}`}>{personal.email}</a></div><form onSubmit={submit}>
 <label>Reason for reaching out<select name="reason" required defaultValue=""><option value="" disabled>Select a reason</option>{reasons.map(reason=><option key={reason} value={reason}>{reason}</option>)}</select></label>
 <label>Mobile number<input type="tel" name="mobile" inputMode="tel" autoComplete="tel" placeholder="+91 98765 43210" minLength={8} maxLength={24} required aria-describedby="mobile-help"/></label>
 <p className="mobile-help" id="mobile-help">Include your country code. Indian 10-digit numbers are also accepted.</p>
 <label className="whatsapp-choice"><input type="checkbox" name="whatsapp"/><span>This number uses WhatsApp</span></label>
 <p className="contact-privacy">Your number and reason will be saved so Annamalai can get back to you. If selected, you can also continue in WhatsApp.</p>
 <button className="button primary" disabled={status.type==='loading'}>{status.type==='loading'?<LoaderCircle className="spin" size={20}/>:null}{status.type==='loading'?'Saving…':'Send request'}<ArrowUpRight size={20}/></button>
 <p className={`form-status ${status.type}`} role="status" aria-live="polite">{status.message}</p>
 {status.whatsappUrl&&<div className="whatsapp-next"><a className="button secondary" href={status.whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={20}/>Continue in WhatsApp<ArrowUpRight size={18}/></a><p>Your request is saved. Press Send in WhatsApp to send the prefilled message.</p></div>}
 </form></div></section>
}
