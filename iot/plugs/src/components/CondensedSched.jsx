import React from 'react'
// import {hma2time} from '../../npm/mqtt-hooks'
// import {hma2time} from '@mckennatim/mqtt-hooks'
import {Clock} from './Clock.jsx'

const CondensedSched = (props)=>{
  const {sch} = props
  // const styles={
  //   schedstr:{
  //     fontSize: fontsz*1,
  //   }
  // }
  const sz=30

  const renderClocks = ()=>{
    let coldef =''
    const clocks = sch.map((s,i)=>{
      const setpt = s.lenght>3 ? (s[2]+s[3])/2 : s[2]==1 ? 'on' : "off"
      coldef = coldef + `${sz}px `
      return(
        <div key={i} >
          <Clock h={s[0]} m={s[1]} sz={sz}/><br/>
          <span>{setpt}</span>
        </div>
      )
    })
    console.log('coldef: ', coldef)
    const container={
      display: 'grid',
      gridTemplateColumns: coldef,
      gridTemplateRows: `${sz}px 12px`
    }
    return(
      <div style={container}>
        {clocks}
      </div>
    )
  }

  const renderSched = ()=>{
    if(sch && sch[0] && sch[0].length>0){
      // const asched = sch.slice().map((s,i)=>{
      //   const ti = hma2time(s)
      //   return (
      //     <span key={i} style={styles.schedstr}>
      //       <span> {ti} </span>
      //       <span > {(s[2]+s[3])/2}&deg; </span>
      //     </span>
      //   )
      // })
      // return asched
      return(
        <div>
          {renderClocks()}
        </div>
      )
    }
    else {
      console.log('no sched repo')
      return(
        <span>  no schedule reported, device offline</span>
      )
    }
  }

  return (<div>{renderSched()}</div>)
}

export{CondensedSched}

