import React from 'react'
import {cfg} from '../utilities/getCfg'

const Items=(props)=>{
  console.log('props: ', props)

  return(
    <div>
      <h1>Items.jsx</h1>
      <a href={cfg.url.authqry}>re-register</a>
    </div>
  )
}

export{Items}