import useTilt from '../hooks/useTilt';import {Code2,Braces,Database,BrainCircuit,Terminal} from 'lucide-react';
const icons=[Code2,Braces,Database,BrainCircuit,Terminal];
export default function SkillCard({skill,index,selected,onClick}){const tilt=useTilt();const Icon=icons[index];return <button {...tilt} className={`skill-category ${selected?'selected':''}`} onClick={onClick} aria-pressed={selected}><Icon size={23}/><span>{skill.name}<small>{skill.subtitle}</small></span><b>0{index+1}</b></button>}
