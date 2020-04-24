import React from 'react'
// import{nav2} from '../app'
import {
  getZinfo,
  whereInSched,
  hma2time,
  m2ms
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

  const toggleOnOff=(typ)=>()=>{
    const newt = !state[typ].darr[0]*1
    changeTo(newt, typ)
  }

  const schedChange=(typ)=>()=>{
    // console.log('asched: ', asched)
    nav2('DailyScheduler', {locdata, asched:state[typ].pro, from:'Control'}, typ)
  }

  const handleWeekly=(typ)=>()=>{
    const zinfo = [getZinfo(typ,zones)]
    console.log('devs,zinfo: ', devs,zinfo,state[typ].pro)
    const sta={}
    sta[typ]=state[typ]
    nav2('WeeklyScheduler', {...props, state:sta, zinfo, sched:state[typ].pro, from:'Control', temp_out:44}, typ)
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

  const renderOnOff=(typ)=>{
    const btext = state[typ].darr[0] ? 'ON': 'OFF'
    const bkg = state[typ].darr[0] ? {background:'green'} : {background:'red'}
    return(<button style={bkg}onClick={toggleOnOff(typ)}>{btext}</button>)
  }

  const renderZone=()=>{
    if(zones.length>0){
      console.log('zones: ',zones)
      console.log('state: ', state)
      console.log('devs: ', devs)
      return(
        <div style={styles.content}>
        <fieldset>
          <legend>GARDEN SHED greenhouse</legend>
          <fieldset style={styles.today}>
            <legend>temp/humidity readings</legend>
            <div><span>
                {getZinf("sgh_temp").name}: {state["sgh_temp"].darr[0]} &deg;F
              </span><br/><span>
                {getZinf("sgh_hum").name}: {state["sgh_hum"].darr[0]} %
              </span><br/>
            </div>
          </fieldset>
          <div style={styles.hold}>
          <fieldset>
            <legend>current schedule for {getZinf("sgh_timr").name}</legend>
            <CondensedSched sch={state["sgh_timr"].pro} fontsz="12"/><br/>
            <span>{state["sgh_timr"].darr[0]==1 ? "ON" : "OFF"}  {findKnext("sgh_timr")}, timeleft:  {m2ms(state["sgh_timr"].timeleft)} </span><br/><span>
            or override: {renderOnOff("sgh_timr")} 
            </span><br/>
            <button classsname='but' style={bt_rel} onClick={schedChange("sgh_timr")}>change todays schedule</button>
            <button classsname='but' style={bt_rel} onClick={handleWeekly("sgh_timr")}>change weekly schedule</button>
          </fieldset>
          </div>
        </fieldset>
        <fieldset>
          <legend>MASTER BEDROOM greenhouse</legend>
          <fieldset style={styles.today}>
            <legend>temp/humidity readings</legend>
            <div><span>
                {getZinf("mb").name}: {state["mb"].darr[0]} &deg;F
              </span><br/><span>
                {getZinf("gh_temp").name}: {state["gh_temp"].darr[0]} &deg;F
              </span><br/><span>
                {getZinf("gh_hum").name}: {state["gh_hum"].darr[0]} %
              </span><br/>
            </div>
          </fieldset>
          <div style={styles.hold}>
          <fieldset>
            <legend>current schedule for {getZinf("gh_timr").name}</legend>
            <CondensedSched sch={state["gh_timr"].pro} fontsz="12"/><br/>
            <span>{state["gh_timr"].darr[0]==1 ? "ON" : "OFF"}  {findKnext("gh_timr")}, timeleft:  {m2ms(state["gh_timr"].timeleft)} </span><br/><span>
            or override: {renderOnOff("gh_timr")} 
            </span><br/>
            <button classsname='but' style={bt_rel} onClick={schedChange("gh_timr")}>change todays schedule</button>
            <button classsname='but' style={bt_rel} onClick={handleWeekly("gh_timr")}>change weekly schedule</button>
          </fieldset>
          </div>
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