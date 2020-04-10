import React, {useContext, useState, useReducer} from 'react'// eslint-disable-line no-unused-vars
import {cfg, ls, makeHref} from '../utilities/getCfg'
// import {nav2} from '../app'
import {Zones} from './Zones.jsx'
import Icon from '@material-ui/core/Icon';
import outdoors from '../img/outdoors.png'
import control from '../img/control.png'
import zone from '../img/zone.png'
import daysched from '../img/daysched.png'
import wksched from '../img/wksched.png'

console.log('cfg: ', cfg)


import {
  connect,
  Context, 
  useDevSpecs,  
  processMessage, 
  setupSocket,
  monitorFocus,
  getDinfo
} from '@mckennatim/mqtt-hooks'
import { useEffect } from 'react';
// } from '../../npm/mqtt-hooks'

const lsh = ls.getItem()

const Control = (props) => {
  const {prups }= props.cambio.page

  // const [doupd,setDoupd]=useState(false)
  // const [bsched, setBsched]=useState({loc:'', sched:[[0,0,0]]})
  // if(prups.doupd){
  //   console.log('prups.sched: ', prups.sched, props.cambio.page.params.query)
  //   setDoupd(true)
  //   setBsched({loc:props.cambio.page.params.query, sched:prups.sched})
  // }
  const [client, publish] = useContext(Context);
  client.onMessageArrived= onMessageArrived

  const changePro =(devs,zones, client)=>{
    console.log('devs,zones: ', props.cambio.page.params.query, devs, zones, prups.sched)
    const ssched = JSON.stringify(prups.sched)
    const di = getDinfo(props.cambio.page.params.query, devs)
    const topic = `${di.dev}/prg`
    const payload = `{"id":${di.sr},"pro":${ssched}}`
    publish(client, topic,payload)
    const reqtop =`${di.dev}/req`
    const reqpay =`{"id":${di.sr},"req":"pro"}`
    publish(client, reqtop,reqpay)
  }

  const doOtherShit=(devs, zones, client)=>{
    console.log('devs: ', devs, zones)
    if (prups.sched && prups.sched.length>1){
      changePro(devs,zones, client)
    }
    publish(client, "presence", "hello form do other shit")
  }

  const topics  = ['srstate', 'sched', 'flags', 'timr'] 

  const {devs, zones, binfo, error}= useDevSpecs(ls, cfg, client, (devs,zones)=>{
    console.log('running usdevSpecs')
    if(!client.isConnected()){
      connect(client,lsh,(client)=>{
        if (client.isConnected()){
          setupSocket(client, devs, publish, topics, (devs, client)=>doOtherShit(devs, zones, client))
        }
      })
    }else{
      setupSocket(client, devs, publish, topics, (devs, client)=>doOtherShit(devs, zones, client))
    }
  })

  const initialState = {
    temp_out: {darr:[0,0,0,0]},
    mb: {darr:[0,0,0,0]},
    gh_temp: {darr:[0,0,0,0]},
    gh_hum: {darr:[0,0,0,0]},
    gh_timr: {pro:[[6,15,1]], timeleft:0, darr:[0,0,0]}
  }
  const[status, setStatus] = useState('focused')
  const [state, dispatch] = useReducer(reducer, initialState);

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
    setStatus(status)
    if (client.isConnected()){
      setupSocket(client, devs, publish, topics, (devs,client)=>doOtherShit(devs,zones, client))
    }
  })
  
  const goSignin =()=>{
    const href = makeHref(window.location.hostname, 'signin', '')//, `?${locid}`)
    window.location.assign(href)
  }

  const changeTo = (onoff, rm)=>{
    console.log('devs: ', devs)
    console.log('zones: ', zones)
    const di = getDinfo(rm,devs)
    const topic = `${di.dev}/cmd`
    const payload = `{"id":${di.sr},"sra":[${onoff}]}`
    console.log('topic,payload: ', topic,payload)
    publish(client, topic, payload)
  }




  useEffect(()=>{
    console.log('prups.sched: ', prups.sched)
    if (prups.sched && prups.sched.length>1){
      console.log('spinn')
      // changePro()

      // const di = getDinfo(props.cambio.page.params.query,devs)
      // const topic = `${di.dev}/prg`
      // const payload = `{"id":${di.sr},"sra":${prups.sched}}`
      // console.log('topic,payload: ', topic,payload)
    }
  }, [prups.sched])
  // console.log('devs,zones: ', devs,zones)

  const rrender=()=>{
    if (!error){
      const {locdata} = binfo
      const ico = status=='blur-disconnected' ? 'block' : 'signal_cellular_alt'
      return(
        <div>
        <header style={styles.header}>
          <div style={styles.container}>
            <div style={styles.ul}><div><a style={styles.a} href="./"><Icon>house</Icon> </a>{locdata && locdata.loc} </div></div>
            <div style={styles.ur}><a style={styles.a} href="./"><Icon>{ico}</Icon> </a></div>
            
            <div style={styles.ll}>
              <div style={styles.txt}><span style={styles.otxt}>outside: </span> {state.temp_out.darr[0]} &deg;F</div>
            </div>
            <div style={styles.lr}>
              <div style={styles.bigd}>
                <a href="./#/bigdata"><span><Icon style={styles.tline}>timeline</Icon></span></a>
              </div>
            </div>
          </div>
        </header>
        <Zones zones={zones} state={state} devs={devs} locdata={locdata} changeTo={changeTo}/>
        </div>

      )
    }else{
      return(
        <div>
          <p>
            From this app on this machine&#39;s perspective, {error.qmessage} It is probably best to
          <button onClick={goSignin}>go and (re-)signin</button>. But maybe nobody has registered you to a paticular location that has some iot devices that run this app. then this is as far as you can go. You can see some screenshots of the app below. 
          </p>
          <img src={control} alt="main page"/>
          <img src={zone} alt="zone page"/>
          <img src={daysched} alt="daysched page"/>
          <img src={wksched} alt="wksched page"/>
        </div>
      )
    }
  }

  return (
    <div>
      {rrender()}
    </div>
  );
};

export{Control}

const styles ={
  header:{
    // position: '-webkit-sticky',
    position: 'sticky',
    top: 0,
    backgroundImage: 'linear-gradient(#3c3c3c,#111 )',
    color:'white'
  },
  out:{
    // background: 'white',
    backgroundImage: `url(${outdoors})`,
    filter:'hue-rotate(180deg)',
    backgroundSize: 'cover',
    width:"40px",
    height:"40px",
    textAlign:'center',

  },
  txt:{
    color:'white'
  },
  otxt:{
    fontSize: '10px'
  },
  tline:{
    color:'white',
    fontSize:'30px'
  },
  bigd:{
    background:'grey',
    width:'30px',
    height:'30px',
    border: '1px solid white',
    borderRadius: '4px'
  },
  container:{
    display: 'grid',
    gridTemplateColumns: 'auto 50px',
    gridTemplateRows: '25px 35px',
  },
  ul:{
    gridColumnStart: 1,
    gridRowStart: 1,
    margin: '6px',
  },
  ur:{
    gridColumnStart: 2,
    gridRowStart: 1,
  },
  ll:{
    gridColumnStart: 1,
    gridRowStart: 2,
    margin: '10px'
  },
  lr:{
    gridColumnStart: 2,
    gridRowStart: 2,
  },
  a:{
    color:'white'
  }
}

