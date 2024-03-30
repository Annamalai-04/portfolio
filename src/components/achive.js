import React from 'react'
import Product from './achieves.json'
export default function Achive() {
  return (
    <div id='ach'>
        <Box1/>
      </div>
  )
}
function Box1(){
  document.addEventListener('DOMContentLoaded',()=>{
    
  })
  return(
        <div id='box'>
          {Product.map((temp)=>(
          <div id='show'>
            <img className='image' src={temp.src} width={'100px'} alt='img'></img>
            <h5>{temp.Sname}</h5>
            <h5>{temp.Dname}</h5>
          </div>))}
        </div>
  
  )
}

