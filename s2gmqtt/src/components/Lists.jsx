import React, {useState, useEffect} from 'react'
import {parseQuery}from '../utilities/wfuncs'
import {ls,cfg} from '../utilities/getCfg'
import {fetchLists} from '../services/fetches'

const Lists=()=>{
  const[lists,setLists]=useState([])
  const[err,setErr]=useState('')
  const[who,setWho]=useState({user:'', email:''})

  const reregmess = 'This machine does not remember you, try re-registering'

  const getLists =()=>{
    const qry = parseQuery(window.location.hash)
    // const message=(decodeURIComponent(qry.message))
    if (qry.token){
      ls.setItem({email:qry.email, token:qry.token})
      window.location.href = window.location.href.split('?')[0]
    }
    if(ls.getItem()){
      fetchLists(ls.getKey('token')).then((r)=>{
        if(r.err){
          setErr(r.err)
        }else if(r.lists.length==0){
          setErr('you have no lists, care to add one?')
        }else{
          setLists(r.lists)
          setWho({user:r.user, email:r.email})
          setErr('')
        }
      }) 
    }else{
      setErr(reregmess)
    }
  }

  useEffect(()=>{
    getLists()
  },[])


  const  gotoItems = (x)=>()=>{
    window.location.href = window.location.href.split('#')[0]+'#items/'+x
  }


  return(
    <div style={styles.fs}>
      <header>
      <span>{who.user}</span>
      <span>{who.email}</span>
      <a href={cfg.authqry}>re-register</a>
      </header>
      <fieldset>
        <legend>Lists</legend>
        <big>{err.message}</big>
        {!err &&
        <ul>
          {lists.map((l)=>{
            return(
              <li style={styles.container} key={l.lid} >
                <div style={styles.type} onClick={gotoItems(l.lid)}>
                  {l.type}
                </div>
                <div style={styles.lid}>
                  {l.lid}
                </div>
                <span style={styles.del} >
                <i className='material-icons'>clear</i> 
                </span>
            </li>
            )
          })}
        </ul>}
        {err==reregmess && 
          <a href={cfg.authqry}>re-register</a>
        }
        
      </fieldset>
    </div>
  )
}

export{Lists}

const styles = {
  container:{
    display: 'grid',
    gridTemplateColumns: '6fr 2fr 1fr',
    gridTemplateRows: '35px 25px',
    border: '1px solid',
    alignItems: 'center',
    backgroundImage:'linear-gradient(0deg, #4474A6, #6DA9D2)',
    color:'white'
  },
  type:{
    gridColumnStart: 1,
    gridColumnEnd: 1,
    gridRowStart: 1,
    gridRowEnd: 'span 2',
    paddingLeft: '14px',
    fontSize: '1.3em'

  },
  lid:{
    gridColumnStart: 2,
    gridColumnEnd: 2,
    gridRowStart: 1,
    gridRowEnd: 1
  },
  del:{
    gridColumnStart: 3,
    gridColumnEnd: 3,
    gridRowStart: 1,
    gridRowEnd: 2
  },
  fs:{
    backgroundColor: '#DB841A'
  }

}