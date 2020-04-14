import React,{useState} from 'react'
// import{nav2} from '../app'
import {
  getZinfo,
  whereInSched,
  hma2time
} from '@mckennatim/mqtt-hooks'
// } from '../../npm/mqtt-hooks'
import '../css/zones.css'
import{nav2} from '../app'
import {bt_rel} from '../css/but.js'
import {CondensedSched} from './CondensedSched.jsx'


const Zones=(props)=>{
  const {zones, state, locdata, devs, changeTo}=props
  const tzadj=locdata ? locdata.tzadj : "0"
  const keys = Object.keys(state)
  console.log('keys: ', keys)
  const tkeys = keys.filter((k)=>k!='temp_out')
  console.log('tkeys: ', tkeys)
  console.log('state: ', state)

  const[hilo, setHilo] =useState({hi:state["temp2b"].darr[2], lo:state["temp2b"].darr[3]})

  console.log('hilo: ', hilo)

  const changeHilo=(hl)=>(e)=>{
    const val =e.target.value*1
    hl=='hi' ? setHilo({...hilo, hi:val}) : setHilo({...hilo, lo:val})
    console.log('hilo: ', hilo)
  }

  const resetHilo=()=>{
    console.log('hilo: ', hilo)
    changeTo([hilo.hi,hilo.lo], "temp2b")
  }

  const toggleOnOff=(str)=>()=>{
    console.log('str, state[str]: ', str, state[str])
    const newt = !state[str].darr[0]*1
    changeTo([newt], str)
  }

  const schedChange=(str)=>()=>{
    const type = str.substring(0,4) == "timr" ? "timr" : "temp"
    // console.log('asched: ', asched)
    nav2('DailyScheduler', {locdata, asched:state[str].pro, from:'Control', type}, str)
  }

  const handleWeekly=(str)=>()=>{
    const type = str.substring(0,4) == "timr" ? "timr" : "temp"
    const zinfo = [getZinfo(str,zones)]

    console.log('devs,zinfo: ', devs,zinfo,state[str].pro)
    const sta={}
    sta[str]=state[str]
    nav2('WeeklyScheduler', {...props, state:sta, zinfo, sched:state[str].pro, from:'Control', temp_out:44, type}, str)
  }

  const getZinf=(str)=>{
    return zones.filter((z)=>z.id==str)[0]
  }

  const findKnext=(k)=>{
    const sched = state[k].pro
    if(sched[0].length>0 && tzadj.length>0){
      const idx = whereInSched(sched, tzadj)
      const s = sched[idx]
      let mess = "til midnight"
      if(idx>-1){
        const ti =hma2time(s)
        const thenwhat = s.length>3 ? ((s[2]+s[3])/2) : s[2]==1 ? 'ON' : 'OFF'
        mess=`til:${ti} then ${thenwhat}`
      }
      console.log('mess: ', mess)
      return(
        mess
      )
    }
  }

  const renderRelayOnoff=()=>{
    const btext = state["temp2b"].darr[1] ? 'ON': 'OFF'
    const bkg = state["temp2b"].darr[1] ? {background:'red',color:'white'} : {background:'green', color:'white'}
    return <span style={bkg}>{btext}</span>
  }

  const renderOnOff=(str)=>{
    const btext = state[str].darr[0] ? 'ON': 'OFF'
    const bkg = state[str].darr[0] ? {background:'green', color:'white'} : {background:'red', color:'white'}
    return(<button style={bkg}onClick={toggleOnOff(str)}>{btext}</button>)
  }

  const renderZone=()=>{
    if(zones.length>0){
      console.log('zones: ',zones)
      console.log('state: ', state)
      console.log('devs: ', devs)
      console.log('state["temp2b"].pro: ', state["temp2b"].pro)
      return(
        <div style={styles.content}>
          <fieldset style={styles.today}>
            <legend>temp/humidity readings</legend>
            <br/>
            <div>
            <span>
                {getZinf("mb").name}: {state["mb"].darr[0]} &deg;F
              </span>
              <br/><br/>
            <span>
                {getZinf("lux").name}: {state["lux"].darr[0]} lux
              </span>
              <br/><br/>
              <span>
                {getZinf("temp3h").name}: {state["temp3h"].darr[0]} &deg;F
              </span>
              <br/><br/>
              <span>
                {getZinf("hum4h").name}: {state["hum4h"].darr[0]} %
              </span>
              <br/><br/>
              <span>
                {getZinf("soil").name}: {state["soil"].darr[0]} %
              </span>
              <br/><br/>
              <span>
                {getZinf("temp1b").name}: {state["temp1b"].darr[0]} &deg;F
              </span>
              <br/><br/>
              <span>
                {getZinf("temp2b").name}: {state["temp2b"].darr[0]} &deg;F
              </span>
              <br/><br/>
            </div>
          </fieldset>
          <div style={styles.hold}>
          <fieldset>
            <legend>current schedule for {getZinf("temp2b").name}</legend>
            <CondensedSched sch={state["temp2b"].pro} fontsz="12"/><br/>
            <fieldset>
              <legend>modify current {findKnext("temp2b")}</legend>
              
              temp   : {state["temp2b"].darr[0]} &deg;F<br/>
              hilimit: <input type="text" value={hilo.hi} onChange={changeHilo('hi')} size="2"/>{state["temp2b"].darr[2]}<br/>
              lolimit: <input type="text" value={hilo.lo} onChange={changeHilo('lo')} size="2"/>{state["temp2b"].darr[3]}<br/>
              <button onClick={resetHilo}>reset hilo</button>
              {renderRelayOnoff()}
            </fieldset>
            <button classsname='but' style={bt_rel} onClick={schedChange("temp2b")}>change todays schedule</button>
            <button classsname='but' style={bt_rel} onClick={handleWeekly("temp2b")}>change weekly schedule</button>
          </fieldset>
          </div>
          <fieldset style={styles.today}>
            <legend>current schedule for {getZinf("timr6").name}</legend>
            <CondensedSched sch={state["timr6"].pro} fontsz="12"/><br/>
            <span>{state["timr6"].darr[0]==1 ? "ON" : "OFF"}  {findKnext("timr6")}</span><br/>
            or override: {renderOnOff("timr6")}<br/>
            <button classsname='but' style={bt_rel} onClick={schedChange("timr6")}>change todays schedule</button>
            <button classsname='but' style={bt_rel} onClick={handleWeekly("timr6")}>change weekly schedule</button>
          </fieldset>
          <fieldset style={styles.today}>
            <legend>current schedule for {getZinf("timr7").name}</legend>
            <CondensedSched sch={state["timr7"].pro} fontsz="12"/><br/>
            <span>{state["timr7"].darr[0]==1 ? "ON" : "OFF"}  {findKnext("timr7")}</span><br/>
            or override: {renderOnOff("timr7")}<br/>
            <button classsname='but' style={bt_rel} onClick={schedChange("timr7")}>change todays schedule</button>
            <button classsname='but' style={bt_rel} onClick={handleWeekly("timr7")}>change weekly schedule</button>
          </fieldset>
        </div> 
      )
    }else{
      return <h4>nozone</h4>
    }
  }

  return(
    <div>
      {renderZone()}
      {/* {renderZones2()} */}
    </div>
  )
}
 

export{Zones}

const styles={
  schedstr:{
    fontSize: 10
  },
  header:{
    // position: '-webkit-sticky',
    position: 'sticky',
    top: 0,
    backgroundImage: 'linear-gradient( #6facd5,#497bae )',
    color:'white'
  },
  content:{
    backgroundColor: '#FFD34E',
    color:'blue'
  },
  boost:{
    backgroundColor: '#FFD34E',
    color:'red'
  },
  hold:{
    backgroundColor: '#DB9E36',
    color: 'blue'
  },
  weekly: {
    backgroundColor: '#BD4932',
    color:'#FFD34E'
  },
  today:{
    backgroundColor: '#FFD34E',
    color:'blue'
  }
}