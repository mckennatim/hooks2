import React, {useState, useEffect} from 'react'
import {parseQuery}from '../utilities/wfuncs'
import {ls,cfg} from '../utilities/getCfg'
import {fetchLists} from '../services/fetches'


const Lists=()=>{
  const[lists,setLists]=useState([])



  const getLists =()=>{
    const qry = parseQuery(window.location.hash)
    window.location.href = window.location.href.split('?')[0]
    // const message=(decodeURIComponent(qry.message))
    if (qry.token){
      ls.setItem({email:qry.email, token:qry.token})
    }
    if(ls.getItem()){
      fetchLists(ls.getKey('token')).then((result)=>{
        const lists = result.result.data
        setLists(lists)
      })
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
      <ul>
        {lists.map((l)=>{
          return(
            <li key={l.lid} onClick={gotoItems(l.lid)}>
              {l.type} {l.lid}
          </li>
          )
        })}
      </ul>
      <a href={cfg.authqry}>re-register</a>
    </div>
  )
}

export{Lists}