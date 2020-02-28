import React, {useEffect, useState} from 'react'
import {ls} from '../utilities/getCfg'
import {fetchDevs, postDevAuth} from '../services/fetches'

const Devs =()=>{
  const locid = window.location.hash.split('/')[1]
  const[devs,setDevs]=useState([])
  const myref = React.createRef();

  const getDevs =()=>{
    fetchDevs(ls.getKey('token'), locid).then((devs)=>{
      const dbdevs = devs.results
      const ckdevs = dbdevs.map((d)=>{
        d.ck = false
        return d
      })
      setDevs(ckdevs)
    })
  }

  useEffect(()=>{
    getDevs()
  },[])

  const signOver=()=>{
    console.log('myref.current: ', myref.current)
  }
  const allowDeveloper=()=>{
    console.log('myref.current: ', myref.current.value)
    const sdevs= devs.map((d)=>{
      return {ck:d.ck, devid:d.devid}
    })
    const data = {email:myref.current.value, devs:sdevs}
    postDevAuth(ls.getKey('token'), data)
  }

  const onChecked =(i)=>(e)=>{
    console.log('e: ', i, e.target.checked)
    const ndevs = [...devs]
    ndevs[i].ck = !ndevs[i].ck
    console.log('ndevs[i]: ', ndevs[i])
    setDevs(ndevs)
    console.log('devs: ', devs)
  }
  const back2locs =()=>{
    window.location.assign('#locs')
  }
  
  const renderDevs=()=>{
    const tlis = devs.map((d,i)=>{
      return(
        <li key={i}>
          <input type="checkbox"checked={d.ck} onChange={onChecked(i)}/>
          {d.devid} {JSON.stringify(d.description)}
        </li>
      )
    })
    return(
      <ul>
        {tlis}
      </ul>
    )
  }

  return(
    <div>
      <h1>devs at {locid}</h1>
      <button onClick={back2locs}>back to locs</button><br/>
      <label htmlFor="emailid">Allow for this email:</label>
      <input type="text" id="emailid" size="40" ref={myref}/><br/>
      <button onClick={signOver}>Sign over title of device</button><br/>
      <button onClick={allowDeveloper}>Allow app developers access to device(s)</button>
      {renderDevs()}
    </div>
  )
}

export{Devs}