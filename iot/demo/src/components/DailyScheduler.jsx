import React from 'react'
// import {ZoneTimer} from '../../npm/react-zonetimer'
import{ZoneTimer}from '@mckennatim/react-zonetimer'
import {nav2 } from '../app'

const DailyScheduler=(props)=>{
  const {prups}=props.cambio.page
  console.log('prups: ', prups)
  const {locdata, asched, from, type} = prups
  const query = props.cambio.page.params.query
  const {sunrise,sunset} = locdata
  // const asched = [[0,0,59,53],[7,45,79,71],[10,50,56,52],[17,45,66,64],[20,50,56,52],[22,50,67,61]]
  // const ret2page = props.cambio.page.prups.from

  const setNewSched=(sched)=>()=>{
    nav2(from, {...prups, locdata, sched, doupd:true}, query)
  }

  const configSvg = ()=>{
    const cfg={}
    if(type=="timr"){
      cfg.range=[0,1]
      cfg.templines =[]
    } else if(type=="temp"){
      cfg.range=[53,74]
      cfg.templines=[
        {v:72,c:'red'}, 
        {v:68, c:'orange'},
        {v:64, c:'green'},  
        {v:60, c:'purple'}, 
        {v:56, c:'blue'}]
    }
    return cfg
  }

  const cfg=configSvg()
  

  return(
    <div style={styles.div}>
      <ZoneTimer 
        range={cfg.range}
        dif={2}
        difrange={12}
        templines={cfg.templines}
        sunrise={sunrise} 
        sunset={sunset}
        asched={asched}
        retNewSched={setNewSched}   
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