import React from 'react'
import {makeHref}from '../utilities/getCfg'
import {Clock} from './Clock.jsx'
import control from '../img/control.png'


const Splash = () =>{
  const signin = makeHref(window.location.hostname, 'signin', '')
  console.log('signin: ', signin)
  const sched=  [[0,0,65,63],[6,47,69,67],[9,24,65,63],[14,30,75,73],[22,0,65,63]] 
  const sz= 30
  const renderClocks = ()=>{
    let coldef =''
    const clocks = sched.map((s,i)=>{
      const setpt = (s[2]+s[3])/2
      coldef = coldef + `${sz}px `

      return(
        <div key={i} >
          <Clock h={s[0]} m={s[1]} sz={sz}/><br/>
          <span>{setpt}</span>
        </div>
      )
    })
    // console.log('coldef: ', coldef)
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

  return (
    <div>
      <h1>splash</h1>
      <img src={control} alt="main page"/>
      <a href="#control">control</a><br/>
      <a href={signin}>signin</a>
      <div>
        {renderClocks()}
      </div>
    </div>
  );
}

export{Splash}

