import React from 'react'
// import{nav2} from '../app'
import {
  getZinfo,
  // whereInSched,
  // hma2time
} from '@mckennatim/mqtt-hooks'
// } from '../../npm/mqtt-hooks'
import '../css/zones.css'
import{nav2} from '../app'
import {bt_rel} from '../css/but.js'
import {CondensedSched} from './CondensedSched.jsx'


const Zones=(props)=>{
  const {zones, state, locdata, devs, changeTo}=props
  // const tzadj=locdata ? locdata.tzadj : "0"
  const keys = Object.keys(state)
  console.log('keys: ', keys)
  const tkeys = keys.filter((k)=>k!='temp_out')
  console.log('tkeys: ', tkeys)
  console.log('state: ', state)

  const toggleOnOff=(str)=>{
    const newt = !state[str].darr[0]*1
    changeTo(newt, str)
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

  const renderOnOff=(str)=>{
    const btext = state[str].darr[0] ? 'ON': 'OFF'
    const bkg = state[str].darr[0] ? {background:'green'} : {background:'red'}
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
            {getZinf("temp2b").name}: {state["temp2b"].darr[0]} &deg;F<br/>
            hilimit: {state["temp2b"].darr[2]} &deg;F<br/>
            <button classsname='but' style={bt_rel} onClick={schedChange("temp2b")}>change todays schedule</button>
            <button classsname='but' style={bt_rel} onClick={handleWeekly("temp2b")}>change weekly schedule</button>
          </fieldset>
          </div>
          <fieldset style={styles.today}>
            <legend>current schedule for {getZinf("timr6").name}</legend>
            <CondensedSched sch={state["timr6"].pro} fontsz="12"/><br/>
            {renderOnOff("timr6")}<br/>
            <button classsname='but' style={bt_rel} onClick={schedChange("timr6")}>change todays schedule</button>
            <button classsname='but' style={bt_rel} onClick={handleWeekly("timr6")}>change weekly schedule</button>
          </fieldset>
          <fieldset style={styles.today}>
            <legend>current schedule for {getZinf("timr7").name}</legend>
            <CondensedSched sch={state["timr7"].pro} fontsz="12"/><br/>
            {renderOnOff("timr7")}<br/>
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