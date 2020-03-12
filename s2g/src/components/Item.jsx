import React, {useState} from 'react'
// import Select from 'react-select'

const Item =(props)=>{
  const {l, i, isChecked, delItem, tagsChanged, locs} =props

  const[edittags, setEdittags]=useState(false)
  const[editloc, setEditloc]=useState(false)

  // const pjsod = JSON.parse(l.jsod)
  // const{amt,tags}=pjsod

  // const[mloc,setMloc] = useState(l.loc) 

  const toggleEditTags=()=>{
    setEdittags(!edittags)
  }

  const toggleEditLoc=()=>{
    setEditloc(!editloc)
  }

  // const changeLoc=(e)=>{
  //   l.loc=e.target.value
  //   toggleEditLoc()
  //   // pjsod.loc=e.target.value
  //   // l.jsod = JSON.stringify(pjsod)
  //   tagsChanged(l)    
  // }

  const changeLoc2=(lo)=>()=>{
    console.log('lo: ', lo)
    l.loc=lo
    toggleEditLoc()
    // pjsod.loc=e.target.value
    // l.jsod = JSON.stringify(pjsod)
    tagsChanged(l)    
  }


  const editTag=(e)=>{
    const val =e.target.value
    if(e.key=='Enter'){
      l.jsod=val
      toggleEditTags()
      tagsChanged(l)
      
    }else if(e.key=='x'){
      l.jsod=''
      toggleEditTags()
      tagsChanged(l)
    }
  }

  // const renderSelect = ()=>{
  //   const opts = locs.map((z,i)=>{
  //     return (
  //       <option key={i}value={z.loc}>{z.loc}</option>
  //     )
  //   })  
  //   return(
  //     <select
  //       value={l.loc}
  //       name="locations"
  //       options={opts}
  //       onChange={changeLoc}>
  //       {opts}  
  //     </select>
  //   )
  // }

  const renderSelect2 = ()=>{
    const opts = locs.map((z,i)=>{
      return (
        <li style={styles.li} key={i} onClick={changeLoc2(z.loc)}>{z.loc}</li>
      )
    })  
    return(
      <ul style={styles.ul}>
        {opts}
      </ul>
    )
  }

  const selopt = renderSelect2()

  const renderLoc =()=>{
    // let isloc =''
    // if (mloc&&locs.length>0) {isloc=mloc}
    // if (!mloc&&locs.length>0) {isloc='--?loc'}
    // if (mloc!=loc){isloc=l.loc}
    if(!l.loc && locs.length>1){l.loc='?'}
    if(editloc){
      return(
        <div   style={styles.loc} onClick={renderSelect2}>
          {selopt}
        </div>
      )
    }else{
      return(
        <div  style={styles.loc} onClick={toggleEditLoc}> {l.loc}</div>
      )
    }
  }

  const renderJsod = ()=>{
    // const qty = amt && amt.qty ? amt.qty : undefined
    // const unit = amt && amt.unit ? amt.unit : undefined
    if(edittags){
      return(
        <div style={styles.tags}>
          <input type="textarea" onKeyPress={editTag}/>
        </div>
      )
    }else{
      return(
        <div style={styles.tags}>
          {l.jsod}
          {/* {qty && <span> qty: {qty}</span>}
          {unit && <span> unit: {unit}</span>}         */}
        </div>
      )
    }
  }  
  

  return(
    <li style={styles.container}>
      <div style={styles.ck}>
        <input type="checkbox" checked={l.done} onChange={isChecked(l,i)}/>
      </div>
      <div style={styles.prod}>{l.product}</div> 
      {renderLoc()}
      {renderJsod()}
      <div style={styles.tage}>
        <i onClick={toggleEditTags} className='material-icons md-6'>add</i> 
      </div>
      <span style={styles.del} onClick={delItem(l)}>
        <i className='material-icons'>clear</i>
      </span>
    </li>
  )
}

export{Item}

const styles = {
  container:{
    display: 'grid',
    gridTemplateColumns: '1fr 8fr 1fr 2fr 1fr',
    gridTemplateRows: '30px 20px',
    border: '1px solid',
    alignItems: 'center',
    backgroundColor:'#C5B8FF',
    color:'black'
  },
  ck:{
    gridColumnStart: 1,
    gridColumnEnd: 1,
    gridRowStart: 1,
    gridRowEnd: 'span 2'
  },
  prod:{
    gridColumnStart: 2,
    gridColumnEnd: 2,
    gridRowStart: 1,
    gridRowEnd: 1,
    fontSize: '1em'
  }, 
  loc:{
    gridColumnStart: 4,
    gridColumnEnd: 4,
    gridRowStart: 1,
    gridRowEnd: 1,
    fontSize: '.6em'
  },
  del:{
    gridColumnStart: 5,
    gridColumnEnd: 5,
    gridRowStart: 1,
    gridRowEnd: 1    
  }, 
  tags:{
    gridColumnStart: 2,
    gridColumnEnd: 3,
    gridRowStart: 2,
    gridRowEnd: 2,
    fontSize: '.7em'   
  },
  tage:{
    gridColumnStart: 3,
    gridColumnEnd: 3,
    gridRowStart: 2,
    gridRowEnd: 2,
    fontSize: '.4em'     
  },
  fs:{
    backgroundColor: '#DB841A'
  },
  ul:{
    zIndex:100,
    position: 'absolute',
    width:'100%'
  },
  li:{
    backgroundColor:'white',
    height:'25px',
    fontSize:'2em'
  }
}