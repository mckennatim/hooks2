import React, {useState} from 'react'

const Item =(props)=>{
  const {l, i, isChecked, delItem} =props

  const[editmode, setEditmode]=useState(false)

  const toggleEditmode=()=>{
    setEditmode(!editmode)
  }

  const renderJsod = (j)=>()=>{
    const pjsod = JSON.parse(j)
    const{amt,loc,tags}=pjsod
    const qty = amt && amt.qty ? amt.qty : undefined
    const unit = amt && amt.unit ? amt.unit : undefined
    if(editmode){
      return(
        <div onClick={toggleEditmode}>
          is toggled to edit
        </div>
      )
    }else{
      return(
        <div>
          {loc&& <span> loc: {loc}</span>}
          {tags && tags.map((t,i)=>(<span key={i}> tag: {t}</span>))}
          {qty && <span> qty: {qty}</span>}
          {unit && <span> unit: {unit}</span>}        
        </div>
      )
    }
  }  
  

  return(
    <div>
      <input type="checkbox" checked={l.done} onChange={isChecked(l,i)}/>
      <span onClick={toggleEditmode}>{l.product}</span> 
      {renderJsod(l.jsod)()}
      <span onClick={delItem(l)}>X</span>
    </div>
  )
}

export{Item}