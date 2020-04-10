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

const TimerZone =(props)=>{
  const {sk, k, changeTo, locdata,devs,zones ,til, zinfo} =props 
  // console.log('locdata: ', locdata)

  const toggleOnOff=()=>{
    const newt = !sk.darr[0]*1
    changeTo(newt, k)
  }

  const renderOnOff=()=>{
    const btext = sk.darr[0] ? 'ON': 'OFF'
    const bkg = sk.darr[0] ? {background:'green'} : {background:'red'}
    return(<button style={bkg}onClick={toggleOnOff}>{btext}</button>)
  }

  const schedChange=()=>{
    // console.log('asched: ', asched)
    nav2('DailyScheduler', {locdata, asched:sk.pro, from:'Control'}, k)
  }

  const handleWeekly=()=>{
    const zinfo = [getZinfo(k,zones)]
    console.log('devs,zinfo: ', devs,zinfo,sk.pro)
    const sta={}
    sta[k]=sk
    nav2('WeeklyScheduler', {...props, state:sta, zinfo, sched:sk.pro, from:'Control', temp_out:44}, k)
    // const pro = state[zid].pro
    // const temp_out = state.temp_out.darr[0]
    // nav2('WeeklyScheduler', {...prups, zinfo, sched:pro, from:'Zone', temp_out, devs}, zid)
  }

  return(
    <div>
      <div>{zinfo.name}</div>
      {renderOnOff()}
      <span>  {til}</span>
        <button classsname='but' style={bt_rel} onClick={schedChange}>change todays schedule</button>
        <button classsname='but' style={bt_rel} onClick={handleWeekly}>change weekly schedule</button>
    </div>
  )
}

const Zones=(props)=>{
  const {zones, state, locdata, devs, changeTo}=props
  const tzadj=locdata ? locdata.tzadj : "0"
  const keys = Object.keys(state)
  console.log('keys: ', keys)
  const tkeys = keys.filter((k)=>k!='temp_out'&&k!='timer')
  console.log('tkeys: ', tkeys)
  // console.log('locdata: ', locdata)
  // console.log('devs: ', devs)

  // const gotoZone=(k)=>()=>{
  //   const zinfo = [getZinfo(k, zones)]
  //   // const dinfo =getDinfo(k, devs)
  //   const tinfo = getZinfo('temp_out', zones)
  //   zinfo.push(tinfo)
  //   const zstate = {}
  //   zstate[k]=state[k]
  //   const mess = findKnext(k)
  //   nav2('Zone', {state: zstate, zinfo, zones, devs, locdata, from:'Zones', mess}, k)
  // }

  const findKnext=(k)=>{
    console.log('k: ', k)
    const sched = state[k].pro
    if(sched[0].length>0 && tzadj.length>0){
      const idx = whereInSched(sched, tzadj)
      const s = sched[idx]
      let then ='frog'
      then = s && s.length>3 ? (s[2]+s[3])/2 : s && s[2]==0 ? 'off' : 'on'
      const ti =s ? hma2time(s): 'dog'//
      const mess = idx==-1 ? "til midnight" : `til:${ti} then ${then}`
      return(
        mess
      )
    }
  }


  const renderZones=()=>{
    if(zones.length>0){
      // console.log(zones)
      // console.log(devs)
      // console.log('devs: ', devs)
      const tli = tkeys.map((k,i)=>{
        const sk = state[k]
        // const set = sk.lenght>3 ? <span>{(sk.darr[2]+sk.darr[3])/2} &deg;F </span> : sk.darr[2]==0 ? <span >off</span> : <span >on</span>
        // const zone = zones.filter((z)=>z.id==k)
        // const ima = `./img/${zone[0].img}`
        // const rt = {
        //   outer:{
        //     float:"right",
        //     margin: '6px',
        //   },
        //   up:{
        //     fontSize:'12px',
        //     fontFamily: 'Helvetica,Arial,sans-serif',
        //     float:'right',
        //     width: '42px',
        //     padding: '2px',
        //     borderRadius: '3px',
        //     background: sk.darr[1] ? 'red' : 'rgba(38, 162, 43, 0.75)'
        //   },
        //   dn:{
        //     fontFamily: 'Helvetica,Arial,sans-serif',
        //     fontStretch: 'ultra-condensed',
        //     float:'right',
        //     fontSize: '8px'
        //   },
        //   temp:{
        //     // float:'left'
        //   }
        // }
        return(
        <li style={styles.li.li} key={i}>
          <TimerZone sk={sk} k={k} changeTo={changeTo} locdata={locdata} zones={zones} devs={devs} til={findKnext(k)} zinfo={getZinfo(k,zones)}/>
          {/* <div className='container'>
            <div className='item-img'>
            <img src={ima} alt={ima} width="70" height="70"/>
            </div> 
            <div className='item-temp'>
              {sk.darr[0]} &deg;F
            </div>  
            <div className='item-name'>
              <div>
              {zone[0].name}
              </div>
            </div>
            <div className='item-setpt'>
              <div style={rt.up}>
                {set}
              </div><br/><br/>
            </div>
            <div className='item-til'>
              <div style={rt.dn}>
                <span style={rt.dn}>{findKnext(k)}</span>
              </div>
            </div>
          </div> */}
        </li>
        )
      })
      return(
        <div>
          <fieldset style={styles.fieldset}>
            <legend>Zones</legend>
            <ul style={styles.ul}>
              {tli}
              
            </ul>     
          </fieldset>

        </div>
      )
    }else{
      return <h4>nozones</h4>
    }
  }

  return(
    <div>
      {renderZones()}
      {/* {renderZones2()} */}
    </div>
  )
}
 

export{Zones}

const styles={
  schedstr:{
    fontSize: 10
  },

  ul: {
    listStyleType:'none',
    listStylePosition: 'inside',
    paddingLeft: 0,
    margin:4
  },
  li:{
    div:{
      display:"block"
    },
    li: {
      border: '1px solid grey'
    }
  },
  fieldset:{
    paddingLeft: 4,
    paddingRight: 4
  }
} 