import React from 'react'
// import {ZoneTimer} from '../../npm/react-zonetimer'
import{ZoneTimer, themodule}from '@mckennatim/react-zonetimer'
import {nav2 } from '../app'

const tm=themodule([0,1])
console.log('tm: ', tm)

const DailyScheduler=(props)=>{
  const {prups}=props.cambio.page
  console.log('prups: ', prups)
  const {locdata, asched, from} = prups
  const query = props.cambio.page.params.query
  const {sunrise,sunset} = locdata
  // const asched = [[0,0,59,53],[7,45,79,71],[10,50,56,52],[17,45,66,64],[20,50,56,52],[22,50,67,61]]
  // const ret2page = props.cambio.page.prups.from

  const setNewSched=(sched)=>()=>{
    nav2(from, {...prups, locdata, sched, doupd:true}, query)
  }

  return(
    <div style={styles.div}>
      <ZoneTimer 
        range={[0,1]}
        dif={2}
        difrange={12}
        templines={[]}
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