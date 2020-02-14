import React from 'react'
import {responsivePage} from '../showRWD'

const App = (props)=>{
  console.log('props: ', props)
  console.log('responsivePage(props): ', responsivePage(props))

  const showPage=()=>{
    return responsivePage(props)
  }

  return(
    <div>
      <h1>In App dog</h1>
      <div>
        {showPage().map((el,i)=>{
          return <div key={i}>{el}</div>
        })}
      </div>
    </div>
  )
}

export {App}