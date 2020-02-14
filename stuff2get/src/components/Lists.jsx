import React, {useState, useEffect} from 'react'
import {parseQuery}from '../utilities/wfuncs'
import {ls,cfg} from '../utilities/getCfg'

console.log('cfg.authqry: ', cfg.url.authqry)

const Lists=(props)=>{
  console.log('props: ', props)
  const[listInfo,setListInfo]=useState([])
  const qry = parseQuery(window.location.hash)
  // const message=(decodeURIComponent(qry.message))
  if (qry.token){
    ls.setItem({email:qry.email, token:qry.token})
  }

  const getLists =()=>{
    if(ls.getItem()){
      console.log('getting locs: ')
      // fetchListInfo(ls.getKey('token')).then((lists)=>{
      //   const listcarr =lists.results.map((l)=>{
      //     return {lid:l.lid, type:l.type}
      //   })
      //   setListInfo(listarr)
      // })
    }
    return listInfo
  }

  useEffect(()=>{
    getLists()
  })



  return(
    <div>
      <h1>Lists.jsx</h1>
      <a href={cfg.url.authqry}>re-register</a>
    </div>
  )
}

export{Lists}