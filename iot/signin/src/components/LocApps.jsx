import React, {useEffect, useState} from 'react'
import {ls, makeHref} from '../utilities/getCfg'
import {storageLocal} from '../utilities/storageLocal'
import {fetchLocApps, fetchToken} from '../services/fetches'


const LocApps = (props)=>{
  const [apps, setApps]= useState([])
  console.log('apps: ', apps)
  const locid = props.cambio.page.params.loc

  const getLocApps=(loc)=>{
    console.log('locid: ', loc)
    fetchLocApps(ls.getKey('token'), locid).then((apps)=>{
      const mapps = apps.results.map((m)=>({app: m.appid, role:m.role}))
      setApps(mapps)
    })
  }

  console.log('locid: ', locid)
  useEffect(()=>{
    console.log('in useEffect')
    getLocApps(locid)
  },[locid])

  const gotoApp =(appid, role)=>()=>{
    fetchToken(ls.getKey('token'), locid, appid, role).then((tok)=>{
      console.log('tok: ', tok)
      console.log('locid: ', locid)
      console.log('role: ', role)
      const apptok = storageLocal(tok.app)
      apptok.setItem(tok.tdata)
      var whereto 
      var qry =''// = role==="installer"||role==="builder" ? role : tok.app
      if (role==="installer"||role==="builder"){
        console.log('whereto, qry: ', whereto, qry)
        whereto=role
        qry = `?${tok.app}`
      } else{
        whereto=tok.app
      }
      const href = makeHref(window.location.hostname, whereto,qry)//, `?${locid}`)
      console.log('href: ', href)
      window.location.assign(href)
    })
  }

  const newApp=()=>{
    window.location.assign(`#newapp/${locid}` ) 
  }

  const manageDevs=()=>{
    window.location.assign(`#devs/${locid}` ) 
  }

  const renderWhat=()=>{
    if(!ls.getKey('token')){
      return(
        <div>
          <h4>This machine has forgotten about you. </h4>
        </div>
      )
    }else{
      const mstyle = respStyle(style.li, props.responsive.size)
      console.log('apps: ', apps)
      const tli = apps
      .filter((f)=>f.role=='user')
      .map((d,i)=>{
        return (
          <li key={i} style={mstyle} onClick={gotoApp(d.app, d.role)}>{d.app} </li>
        )
      })
      return (
        <ul>
          {tli}
        </ul>
      )
    }
  }

  return(
    <div>
      <h3>Apps at {locid}</h3>
      {renderWhat()}
      <span>
        Choose a different <a href="#locs">location</a>?
      </span><br/>
      <span>
        <button onClick={newApp}>Add another app at this location</button><br/>
        <button onClick={manageDevs}>Manage my devices at this location</button>
      </span>
    </div>
  )
}

export{LocApps}

let style ={
  li:{
    display: "block",
    width: "50%",
    padding: "10px",
    background:"white",
    border: "solid 1px"
  }
}

const respStyle =(s,sz)=>{
  const n = {}
  if (sz<500){
    n.width="80%"
  }
  return ({...s, ...n})

}