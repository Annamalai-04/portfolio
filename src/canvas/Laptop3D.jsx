import {useMemo,useRef,useEffect} from 'react';
import {useFrame} from '@react-three/fiber';
import {RoundedBox} from '@react-three/drei';
import * as THREE from 'three';

function createKeyboard(){
 const canvas=document.createElement('canvas');canvas.width=1400;canvas.height=580;
 const x=canvas.getContext('2d');x.fillStyle='#424c59';x.fillRect(0,0,1400,580);
 const rows=[['esc','1','2','3','4','5','6','7','8','9','0','−','=','⌫'],['tab','Q','W','E','R','T','Y','U','I','O','P','[',']','\\'],['caps','A','S','D','F','G','H','J','K','L',';','\'','enter'],['shift','Z','X','C','V','B','N','M',',','.','/','shift'],['fn','ctrl','alt','cmd','space','cmd','alt','←','↑','↓','→']];
 rows.forEach((row,r)=>{const units=row.map(label=>label==='space'?5:label==='shift'?1.6:label==='enter'||label==='caps'?1.45:1);const unit=1350/units.reduce((a,b)=>a+b,0);let left=25;row.forEach((label,i)=>{const width=units[i]*unit-10;const top=18+r*111;x.shadowColor='#bce9ff';x.shadowBlur=3;x.fillStyle='#a8bbcd';x.beginPath();x.roundRect(left,top,width,94,9);x.fill();x.shadowBlur=0;x.fillStyle='#111a25';x.beginPath();x.roundRect(left+2,top+2,width-4,88,8);x.fill();x.fillStyle='#edf7ff';x.font=label.length>2?'20px Arial':'26px Arial';x.textAlign='center';x.textBaseline='middle';if(label!=='space')x.fillText(label,left+width/2,top+44);left+=units[i]*unit})});
 return new THREE.CanvasTexture(canvas);
}
function createScreen(){const c=document.createElement('canvas');c.width=1200;c.height=760;const x=c.getContext('2d');x.fillStyle='#0b1421';x.fillRect(0,0,1200,760);x.fillStyle='#1b2939';x.fillRect(0,0,1200,48);['#fa8b89','#f2cf80','#8fe0b4'].forEach((col,i)=>{x.fillStyle=col;x.beginPath();x.arc(24+i*24,24,6,0,7);x.fill()});x.font='18px monospace';x.fillStyle='#abb9ca';x.fillText('annamalai / portfolio.jsx',140,30);x.fillStyle='#101d2c';x.fillRect(0,48,190,680);x.font='18px monospace';['EXPLORER','⌄ portfolio','  src','  components','  data','  App.jsx'].forEach((s,i)=>{x.fillStyle=i===5?'#8ee6d2':'#8096ad';x.fillText(s,20,92+i*37)});const lines=['// From an idea to something useful.','','const developer = {','  name: "Annamalai",','  role: "Software Developer",','  languages: [','    "Java", "Python", "JavaScript"','  ],','  approach: "Build with purpose"','};','','export default developer;'];lines.forEach((s,i)=>{x.font='17px monospace';x.fillStyle='#435c72';x.fillText(String(i+1),212,106+i*44);x.font='25px monospace';x.fillStyle=i===0?'#6b859c':i%3===0?'#bea7f6':'#91dfcd';x.fillText(s,255,106+i*44)});x.fillStyle='#234a55';x.fillRect(0,727,1200,33);x.font='17px monospace';x.fillStyle='#c2eee7';x.fillText('  main     ✓ Ready to build                                      JavaScript React',15,750);return new THREE.CanvasTexture(c)}

export default function Laptop3D({reduced}){
 const ref=useRef();const[keyboard,screen]=useMemo(()=>[createKeyboard(),createScreen()],[]);
 useEffect(()=>()=>{keyboard.dispose();screen.dispose()},[keyboard,screen]);
 useFrame(({pointer,clock})=>{ref.current.rotation.y=THREE.MathUtils.lerp(ref.current.rotation.y,-.2+(reduced?0:pointer.x*.12),.05);ref.current.rotation.x=THREE.MathUtils.lerp(ref.current.rotation.x,.02-(reduced?0:pointer.y*.05),.05);ref.current.position.y=reduced?0:Math.sin(clock.elapsedTime*.65)*.065});
 return <group ref={ref} rotation={[.02,-.2,0]}>
   <RoundedBox args={[4.25,.12,2.8]} radius={.055} smoothness={3} position={[0,-.015,1.12]}><meshStandardMaterial color="#a8b9cb" metalness={.72} roughness={.32}/></RoundedBox>
   <mesh rotation={[-Math.PI/2,0,0]} position={[0,.052,.82]}><planeGeometry args={[3.64,1.48]}/><meshBasicMaterial map={keyboard} toneMapped={false}/></mesh>
   <RoundedBox args={[1.46,.016,.65]} radius={.045} position={[0,.055,2]}><meshStandardMaterial color="#8296ae" metalness={.55} roughness={.38}/></RoundedBox>
   <mesh position={[0,-.014,2.523]}><boxGeometry args={[.65,.025,.012]}/><meshStandardMaterial color="#3f5063"/></mesh>
   {[-1,1].map(side=><mesh key={side} position={[side*1.96,.048,.85]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[.08,1.35]}/><meshStandardMaterial color="#485c71"/></mesh>)}
   <group position={[0,.04,-.21]} rotation={[-.12,0,0]}>
     <RoundedBox args={[4.22,2.84,.105]} radius={.07} position={[0,1.42,0]}><meshStandardMaterial color="#829bb4" metalness={.75} roughness={.3}/></RoundedBox>
     <RoundedBox args={[4.08,2.68,.02]} radius={.045} position={[0,1.42,.06]}><meshStandardMaterial color="#101b28"/></RoundedBox>
     <mesh position={[0,1.42,.073]}><planeGeometry args={[3.92,2.48]}/><meshBasicMaterial map={screen} toneMapped={false}/></mesh>
     <mesh position={[0,2.73,.08]}><sphereGeometry args={[.018,8,8]}/><meshBasicMaterial color="#80b9d7"/></mesh>
   </group>
 </group>;
}
