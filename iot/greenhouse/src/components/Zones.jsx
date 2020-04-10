import React from 'react'
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

  const toggleOnOff=()=>{
    const newt = !state["gh_timr"].darr[0]*1
    changeTo(newt, "gh_timr")
  }

  const schedChange=()=>{
    // console.log('asched: ', asched)
    nav2('DailyScheduler', {locdata, asched:state["gh_timr"].pro, from:'Control'}, "gh_timr")
  }

  const handleWeekly=()=>{
    const zinfo = [getZinfo("gh_timr",zones)]
    console.log('devs,zinfo: ', devs,zinfo,state["gh_timr"].pro)
    const sta={}
    sta["gh_timr"]=state["gh_timr"]
    nav2('WeeklyScheduler', {...props, state:sta, zinfo, sched:state["gh_timr"].pro, from:'Control', temp_out:44}, "gh_timr")
  }

  const renderOnOff=()=>{
    const btext = state["gh_timr"].darr[0] ? 'ON': 'OFF'
    const bkg = state["gh_timr"].darr[0] ? {background:'green'} : {background:'red'}
    return(<button style={bkg}onClick={toggleOnOff}>{btext}</button>)
  }

  const renderZone=()=>{
    if(zones.length>0){
      console.log('zones: ',zones)
      console.log('state: ', state)
      console.log('devs: ', devs)
      return(
        <div style={styles.content}>
          <fieldset style={styles.today}>
            <legend>temp/humidity readings</legend>
            <br/>
            <div>
              <span>
                {zones[1].name}: {state["gh_temp"].darr[0]} &deg;F
              </span>
            <br/><br/>
              <span>
                {zones[2].name}: {state["gh_hum"].darr[0]} %
              </span>
              <br/><br/>
            </div>
          </fieldset>
          <div style={styles.hold}>

          <fieldset>
            <legend>override schedule section</legend>
            <br/>
          <div>{zones[3].name}</div>
            {renderOnOff()}
            <br/><br/>
          </fieldset>
          </div>
          <fieldset style={styles.today}>
            <legend>current schedule</legend>
            <CondensedSched sch={state["gh_timr"].pro} fontsz="12"/><br/>
            <button classsname='but' style={bt_rel} onClick={schedChange}>change todays schedule</button>
            <button classsname='but' style={bt_rel} onClick={handleWeekly}>change weekly schedule</button>
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