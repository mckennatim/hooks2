import React from 'react'
import {ZoneTimer, themodule} from '../../npm/react-zonetimer'
// import{ZoneTimer}from '@mckennatim/react-zonetimer'
import {nav2 } from '../app'

const DailyScheduler=(props)=>{
  const {prups}=props.cambio.page
  const {locdata, from,typ} = prups
  const dur = typ=='pond' ? 20 : 150
  let {asched} = prups
  const query = props.cambio.page.params.query
  const {sunrise,sunset} = locdata
  const range = [0,1]
  const dif=2
  const tm = themodule(range)
  const now =tm.getNow(locdata.tzadj)
  // const asched = [[0,0,59,53],[7,45,79,71],[10,50,56,52],[17,45,66,64],[20,50,56,52],[22,50,67,61]]
  // const ret2page = props.cambio.page.prups.from

  const setNewSched=(sched)=>()=>{
    nav2(from, {...prups, locdata, sched, doupd:true}, query)
  }

  const parseToday =()=>{
    if(asched && from =="Control"){
      console.log('fromControl')
      const shsched = asched.filter((s)=>{
        const hm = now.split(':')
        return s[0]==0 || s[0]>hm[0]*1
      })
      asched=shsched
    }
    return asched
  }

  asched=parseToday()
  console.log('asched: ', asched)

  return(
    <div style={styles.div}>
      <ZoneTimer 
        range={range}
        dif={dif}
        difrange={12}
        templines={[]}
        sunrise={sunrise} 
        sunset={sunset}
        now={now}
        asched={asched}
        retNewSched={setNewSched}   
        dur={dur}
      />
    </div>
  )
}

export{DailyScheduler}

const styles = {
  div:{
    overscrollBehaviorY: "none",
    overscrollBehaviorX: "none",
    position: "fixed",
    overflow: "hidden"
  }
}