import React from 'react'
import { Link } from 'react-router-dom'
import Data from './skill.json'
export default function About() {
  return (
    <div id='about'>
      <Details/>
      <AboutMe/>
      <Skills  />
      <SocialLink/>
    </div>
  )
}
function Details(){
  return(
    <div id='first'>
      <h5>Email: <Link>annamalaikumar13@gmail.com</Link></h5>
      <h5>Mobile No: 7339339065</h5>
    </div>

  )
}
function AboutMe(){
  return(
    <div id='aboutme'>
      <p style={{textWrap:'wrap',marginTop:'10px'}}>As a Fresher, I am passionate in learning 
      Software Developing and able to use it practically to develop a dynamic websites with 
      responsive to all devices. My short term goal is to became a software developer 
      (Frontend or backend) in a good reputed IT Company.My Long term goal is to see me at the top 
      position in the IT field. See Below for Skills and Qualities I have...
      </p>
    </div>
  )
}
function Skills(){
  
  return(
    <div id='second'>
      <SoftSkills items={Data}/>
      <HardSkills items={Data}/>
      <Hobbies items={Data}/>
    </div>
  )
}
function SoftSkills(props){
  const {items}=props;
  return(
<div id='b1'><h1 style={{color:'limegreen'}}>Soft Skills</h1>
      <ol style={{listStyle:'none'}}>
        {items.map((temp)=>(<li id='skillset' key={temp.id}>{temp.soft}</li>))}
      </ol>
      </div>
  )
}
function HardSkills(props){
  const {items}=props;

  return(
<div id='b2'><h1 style={{color:'limegreen'}}>Technical Skills</h1>
      <ol style={{listStyle:'none'}}>
      {items.map((temp)=>(<li id='skillset' key={temp.id}>{temp.hard}</li>))}
      </ol>
      </div>
  )
}
function Hobbies(props){
  const {items}=props;

  return(
    <div id='b3'><h1 style={{color:'limegreen'}}>Hobbies & Interests</h1>
    <ol style={{listStyle:'none'}}>
    {items.map((temp)=>(<li id='skillset' key={temp.id}>{temp.hobby}</li>))}
    </ol>
    </div>
  )
}
function SocialLink(){
  return(
    <div id='social'>
      <Link to={'https://www.linkedin.com/in/anna-malai-5a482b193/'} target='blank'><i class="fa-brands fa-linkedin"></i></Link>
      <Link to={'https://www.youtube.com/channel/UC8ntcgBRCu5DaHExmk5l2Ww'} target='blank'><i class="fa-brands fa-youtube"></i></Link>
      <Link to={'https://twitter.com/annaXmalai_IN'} target='blank'><i class="fa-brands fa-x-twitter"></i></Link>
      <Link to={'https://www.instagram.com/annamalai_india/'} target='blank'><i class="fa-brands fa-instagram"></i></Link>
      <Link to={'https://www.facebook.com/profile.php?id=100023858332281'} target='blank'><i class="fa-brands fa-facebook"></i></Link>
    </div>
  )
}
