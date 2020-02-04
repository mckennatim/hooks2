import React, {useContext, useState, useReducer}from 'react'// eslint-disable-line no-unused-vars
import {cfg, ls, makeHref} from '../utilities/getCfg'

import {
  connect,
  Context, 
  useDevSpecs,  
  processMessage, 
  getZinfo,
  getDinfo, 
  setupSocket,
  monitorFocus
} from '@mckennatim/mqtt-hooks'

// import {
//   Context, 
//   useDevSpecs,  
//   processMessage, 
//   getZinfo,
//   getDinfo, 
//   setupSocket,
//   monitorFocus
// } from '../../nod/src'

const lsh = ls.getItem()

const Zones=(props)=>{
  const {zones, devs, state, locdata}=props
  const tzadj=locdata ? locdata.tzadj : "0"
  const keys = Object.keys(state)
  const tkeys = keys.filter((k)=>k!='temp_out'&&k!='timer')
  console.log('tzadj, tkeys,devs: ', tzadj, tkeys,devs)

  const renderZones=()=>{
    if(zones.length>0){
      const z1 = getZinfo('temp',zones)
      const z3 = getZinfo('temp_out',zones)
      const z4 = getZinfo('timer', zones)
      return(
        <div>
          <h3>{z3.name}: {state.temp_out.darr[0]}</h3>
          <h3>{z1.name}: {state.temp.darr[0]}</h3>
          <h4>{z4.name} program has them on for another {state.timer.timeleft/60} minutes</h4>
        </div>
      )
    }else{
      return <h4>nozones</h4>
    }
  
  }
  return(
    <div>
      {renderZones()}
    </div>
  )
}

const Control = () => {
  const [client, publish] = useContext(Context);
  client.onMessageArrived= onMessageArrived

  const doOtherShit=()=>{
    //console.log('other shit but not connected doesnt work yet')
    //publish(client, "presence", "hello form do other shit")
  }

  const topics  = ['srstate', 'sched', 'flags', 'timr'] 
  const {devs, zones, binfo, error}= useDevSpecs(ls, cfg, client, (devs)=>
    connect(client,lsh,(client)=>{
      if (client.isConnected()){
        setupSocket(client, devs, publish, topics, (devs, client)=>doOtherShit(devs, client))
      }
    })
  )


  const initialState = {
    temp: {pro:[[]], darr:[0,0,0,0]},
    timer: {pro:[[]], darr:[0,0,0,0]},
    temp_out: {darr:[0,0,0,0]},
  }
  const [state, dispatch] = useReducer(reducer, initialState);
  const[status, setStatus] = useState('focused')

  const [prog, setProg] = useState('[[0,0,0]]')

  function reducer(state,action){
    const nstate = {...state}
    nstate[action.type]= action.payload
    return nstate
  }
  function onMessageArrived(message){
    const nsarr = processMessage(message, devs, state)
    if(nsarr.length>0){
      nsarr.map((ns)=>{
        const key =Object.keys(ns)[0]
        const action = {type:key, payload:ns[key]}
        dispatch(action)
      })
    }
  }

  monitorFocus(window, client, lsh, (status, client)=>{
    console.log('status: ', status)
    setStatus(status)
    if (client.isConnected()){
      setupSocket(client, devs, publish, topics, (devs,client)=>doOtherShit(devs,client))
    }
  })
  
  const toggleOnOff=()=>{
    const dinfo = getDinfo('timer', devs)
    const newt = !state.timer.darr[0]*1
    const topic = `${dinfo.dev}/cmd`
    const payload = `{"id":${dinfo.sr},"sra":[${newt}]}`
    console.log('topic + payload: ', topic + payload)

    publish(client, topic, payload)
  }

  const changeProg=(e)=>{
    console.log('e.target.value: ', e.target.value)
    setProg(e.target.value)
  }

  const sendChange=()=>{
    console.log('prog: ', prog)
    const dinfo = getDinfo('timer', devs)
    const topic = `${dinfo.dev}/prg`
    const payload = `{"id":${dinfo.sr},"pro":${prog}}`
    console.log('topic + payload: ', topic + payload)
    publish(client, topic, payload)
  }
  const goSignin =()=>{
    const href = makeHref(window.location.hostname, 'signin', '')//, `?${locid}`)
    console.log('href: ', href)
    window.location.assign(href)
  }

  const renderProg=()=>{
    return(
      <div>
        <input type="text" size="30" onChange={changeProg} value={prog}/>
        <button onClick={sendChange}>change prog for today</button>
      </div>
    )
  }

  const renderOnOff=()=>{
    const btext = state.timer.darr[0] ? 'ON': 'OFF'
    const bkg = state.timer.darr[0] ? {background:'green'} : {background:'red'}
    return(<button style={bkg}onClick={toggleOnOff}>{btext}</button>)
  }

  const rrender=()=>{
    if (!error){
      const {locdata} = binfo
      return(
        <div>
          <h1>Tester</h1>\
          <Zones zones={zones} state={state} devs={devs} locdata={locdata}/>
          {/* <Zones zones={zones} temp_out={temp_out} temp_gh={temp_gh} hum_gh={hum_gh} timer={timer}/> */}
          {renderOnOff()}
          {renderProg()}
          <pre>{JSON.stringify(devs, null, 2)}</pre><br/>
          <pre>{JSON.stringify(zones, null, 4)}</pre> <br/>
          <pre>{JSON.stringify(binfo, null, 4)}</pre>
        </div>

      )
    }else{
      return(
        <div>
          <p>
            From this app on this machine&#39;s perspective, {error.qmessage} It is probably best to
          <button onClick={goSignin}>go and (re-)signin</button>
          </p>
        </div>
      )
    }
  }

  return (
    <div>
      {status}
      {rrender()}
    </div>
  );
};

export{Control}

