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
  // const keys = Object.keys(state)
  // const tkeys = keys.filter((k)=>k!='temp_out')

  const toggleOnOff=(typ)=>()=>{
    const newt = !state[typ].darr[0]*1
    changeTo(newt, typ)
  }

  const schedChange=(typ)=>()=>{
    // console.log('asched: ', asched)
    nav2('DailyScheduler', {locdata, asched:state[typ].pro, from:'Control',typ}, typ)
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
      return(
        <div style={styles.content}>
        <fieldset>
          <legend>Pond</legend>
          <div style={styles.hold}>
          <fieldset>
            <legend>current schedule for {getZinf("pond").name}</legend>
            <CondensedSched sch={state["pond"].pro} fontsz="12"/><br/>
            <span>{state["pond"].darr[0]==1 ? "ON" : "OFF"}  {findKnext("pond")}, timeleft:  {m2ms(state["pond"].timeleft)} </span><br/><span>
            or override: {renderOnOff("pond")} 
            </span><br/>
            <button classsname='but' style={bt_rel} onClick={schedChange("pond")}>change todays schedule</button>
            <button classsname='but' style={bt_rel} onClick={handleWeekly("pond")}>change weekly schedule</button>
          </fieldset>
          </div>
        </fieldset>
        <fieldset>
          <legend>Upper Garden Bed</legend>
          <div style={styles.hold}>
          <fieldset>
            <legend>current schedule for {getZinf("hi_bed").name}</legend>
            <CondensedSched sch={state["hi_bed"].pro} fontsz="12"/><br/>
            <span>{state["hi_bed"].darr[0]==1 ? "ON" : "OFF"}  {findKnext("hi_bed")}, timeleft:  {m2ms(state["hi_bed"].timeleft)} </span><br/><span>
            or override: {renderOnOff("hi_bed")} 
            </span><br/>
            <button classsname='but' style={bt_rel} onClick={schedChange("hi_bed")}>change todays schedule</button>
            <button classsname='but' style={bt_rel} onClick={handleWeekly("hi_bed")}>change weekly schedule</button>
          </fieldset>
          </div>
        </fieldset>
        <fieldset>
          <legend>Lower Garden Bed</legend>
          <div style={styles.hold}>
          <fieldset>
            <legend>current schedule for {getZinf("lo_bed").name}</legend>
            <CondensedSched sch={state["lo_bed"].pro} fontsz="12"/><br/>
            <span>{state["lo_bed"].darr[0]==1 ? "ON" : "OFF"}  {findKnext("lo_bed")}, timeleft:  {m2ms(state["lo_bed"].timeleft)} </span><br/><span>
            or override: {renderOnOff("lo_bed")} 
            </span><br/>
            <button classsname='but' style={bt_rel} onClick={schedChange("lo_bed")}>change todays schedule</button>
            <button classsname='but' style={bt_rel} onClick={handleWeekly("lo_bed")}>change weekly schedule</button>
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