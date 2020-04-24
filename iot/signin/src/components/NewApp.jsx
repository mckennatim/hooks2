import React ,{useState, useEffect}from 'react'
import {ls} from '../utilities/getCfg'
import { fetchDevsSpecs, postAppLoc, fetchIsCorrectDevs } from '../services/fetches'


const NewApp = ()=>{
  console.log('window.location.hash: ', window.location.hash)
  const locid = window.location.hash.split('/')[1]
  const [app, setApp] = useState('plugs')
  const [apploc, setApploc]= useState()
  const [specs,setSpecs]=useState([])

  const nextChar =(e)=>{
    setApp(e.target.value)

  }

  const getAppLoc =(app,fname)=>{
    const jloc = `${window.location.href.split('signin')[0]}${app}/${fname}`
    console.log('jloc: ', jloc)
    fetch(jloc).then(response=>response.json()).then(json=>{
      console.log('json: ', json)
      setApploc(json)
    })
  }
  const clickGet=()=>{
    getAppLoc(app, `${app}_${locid}.json`)
  }

  const back2locs =()=>{
    window.location.assign('#locs')
  }

  const getSpecs = ()=>{
    fetchDevsSpecs(ls.getKey('token'),locid)
    .then((dspecs)=>{
      console.log('dspecs: ', dspecs)
      setSpecs(dspecs)
    })
  }

  useEffect(()=>{
    getSpecs()
    getAppLoc(app,'app_loc.json')
  },[])

  const updateDb=()=>{
    const devarr = Object.keys(apploc.devs)
    fetchIsCorrectDevs(ls.getKey('token'),devarr).then((data)=>{
      if(data){
        console.log('apploc.devs,devarr: ', apploc.devs,devarr)
        const dapploc = {
          devs:devarr, 
          apploc:{...apploc, 
            appid:app, 
            locid:locid, 
            devs:JSON.stringify(apploc.devs), 
            zones:JSON.stringify(apploc.zones)
          }
        }
        console.log('dapploc: ', dapploc)
        postAppLoc(ls.getKey('token'),dapploc)
        .then((data)=>{
          console.log('data: ', data)
        })
      }else{
        window.alert("Some of your devids don't seem to exist so the update did not happen")
        console.log('failed: ')
      }
    })
  }

  const renderAppLoc=()=>{
    if (specs.length>0){
      return(
        <div>
          {/* <button onClick={getSpecs}>Get devices specs...</button> */}
          <p>
            View the device specs available to you at this location. Select the sensors/relays (srs) you want to use in your app. Create or edit an iot app and save a renamed app_loc.json file as< b> {`${app}_${locid}.json`}</b>. Include a devs and zone object in your json file based on the device specs avaialble to you. Once you are done import it and then update the db.
          </p>
          <span>
            Edit your aploc file in the your editor then bring it here.
          </span>
          <button onClick={clickGet}>import {`${app}_${locid}.json`}</button>
          <pre>{JSON.stringify(apploc, null, 2)}</pre><br/>
          <button onClick={updateDb}>Update db for {app}@{locid}</button>
        </div>
      )
    }else{
      return(
        <p>You do not seem to have access to any devices at this location. ask the owner for access.</p>
      )
    }
  }

  const renderSpecs=()=>{

    // console.log('specs: ', specs)
    // const tli =specs
    const tli = specs.map((s,i)=>{
      // const sp = JSON.parse(s.specs).sr
      return(
        <li key={i}>
          {s.devid}<br/>
          {s.specs}
          {/* <pre>{JSON.stringify(sp, null, 2)}</pre><br/> */}
        </li>
      )
    })
    return(
      <div>
        <h4><u>Devices, sensors and relays available to you at {locid}</u></h4>
        <ul>
        {tli}
        </ul>
      </div>
    )
  }

  return(
    <div>
      <h4>NewApp at {locid} for {ls.getKey('email')}</h4>
      <button onClick={back2locs}>back to locs</button><br/>
      <label htmlFor="apname">new app name</label>
      <input id="appname" type="text" value={app}onChange={nextChar}/><br/>
      {renderAppLoc()}
      {renderSpecs()}
      
    </div>
  )  
}

export{NewApp}