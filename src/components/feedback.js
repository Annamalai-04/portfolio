import React, { useState } from 'react'

export default function Feedback() {
      
  const [inputs,setInputs]=useState({});
  function SubmitFunction(e){
    e.preventDefault();
    document.myform.name.value='';
    document.myform.email.value='';
   let op1= document.getElementById('op1');
   let op2= document.getElementById('op2');
   let op3= document.getElementById('op3');
  if(op1.checked||op2.checked || op3.checked){
    op1.checked=false;
    op2.checked=false;
    op3.checked=false;
  }
    alert("Thank you "+inputs.name+" for your "+ inputs.op+" feedback");
    
  }
  function SubFunction(e){
       const opinion=e.target.op;
       const v1=e.target.value;
       const name=e.target.name;
       const v2=e.target.value;
       setInputs((ps)=>{return{...ps,[name]: v2,[opinion]:v1};
      });
  }

  
  return (
    <div id='feed'>
      <h1>Feedback page</h1>
      <form name='myform' onSubmit={SubmitFunction}>
        <label>
          Name : <input type='text' name='name' onChange={SubFunction}/>
        </label>
        <br/>
        <label>
          Email : <input type='text' name='email' onChange={SubFunction}/>
        </label>
        <br/>
        <label>Opinion:  &nbsp;</label>
        <label>
          <input type='radio' value={'awesome'} id='op1'  name='op' onChange={SubFunction}/>
          Awesome 
        </label>
        <label>
         <input type='radio' value={'good'} id='op2'   name='op' onChange={SubFunction}/>
         Good 
        </label>
        <label>
         <input type='radio' value={'bad'} id='op3'   name='op' onChange={SubFunction}/>
         Bad 
        </label>
        <br/>
        <input type='submit' value="Submit Form"/>
      </form>
    </div>
  )
}
