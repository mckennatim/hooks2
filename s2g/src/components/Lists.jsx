import React, {useState, useEffect} from 'react'
import {parseQuery}from '../utilities/wfuncs'
import {ls,cfg} from '../utilities/getCfg'
import {fetchLists} from '../services/fetches'


const Lists=()=>{
  const[lists,setLists]=useState([])
  const[err,setErr]=useState('')

  const reregmess = 'This machine does not remember you, try re-registering'

  const getLists =()=>{
    console.log('window.location', window.location)
    const qry = parseQuery(window.location.hash)
    console.log('qry: ', qry)
    // const message=(decodeURIComponent(qry.message))
    if (qry.token){
      ls.setItem({email:qry.email, token:qry.token})
      window.location.href = window.location.href.split('?')[0]
    }
    if(ls.getItem()){
      fetchLists(ls.getKey('token')).then((r)=>{
        console.log('r: ', r)
        if(r.err){
          setErr(r.err)
        }else if(r.lists.length==0){
          setErr('you have no lists, care to add one?')
        }else{
          setLists(r.lists)
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
    <div>
      <h1>Lists.jsx</h1>
      <big>{err}</big>
      <ul>
        {lists.map((l)=>{
          return(
            <li key={l.lid} onClick={gotoItems(l.lid)}>
              {l.type} {l.lid}
          </li>
          )
        })}
      </ul>
      {err==reregmess && 
        <a href={cfg.authqry}>re-register</a>
      }
      <a href={cfg.authqry}>re-register</a>
    </div>
  )
}

export{Lists}