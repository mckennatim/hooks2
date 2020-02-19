import React, {useState, useEffect}  from 'react'
import {ls, cfg} from '../utilities/getCfg'
import {parseQuery}from '../utilities/wfuncs'
import {fetchItems, searchItems} from '../services/fetches'
// import {fromEvent,from,} from 'rxjs';
// import {
//   map, 
//   filter,
//   distinctUntilChanged,
//   debounceTime,
//   switchMap,
// } from 'rxjs/operators';


const Items=()=>{
  const qry = parseQuery(window.location.hash)

  const[phrase,setPhrase]=useState('')
  const[items,setItems]=useState([])
  const[found,setFound]=useState([])

  const getItems=()=>{
    if(ls.getItem()){
      console.log('getting items: ')
      fetchItems({token:ls.getKey('token'), lid:qry.lid}).then((result)=>{
        const items = result.result.data
        setItems(items)
      })
    }
  }

  useEffect(()=>{
    getItems()
  },[qry.lid])

  console.log('items: ', items)

  const search = (e)=>{
    const v =e.target.value
    setPhrase(v)
    if(v.length>1){
      searchItems({token:ls.getKey('token'), lid:qry.lid, qry:v})
      .then((result)=>{
        const f = result.result.data
        setFound(f)
      })
    }
  }

  const selectFound=(f)=>()=>{
    setPhrase('')
    f.done=0
    console.log('items.push(): ', items.push(f))
    setItems(items)
    setFound([])
    //updateItem(f.id)
  }


  const renderFound=()=>{
    return(
      <ul>
        {found.map((f,i)=>{
          return(
            <li key={i} onClick={selectFound(f)}>
              {f.product} 
          </li>
          )
        })}
      </ul>
    )
  }


  const renderItems = ()=>{
    return(
      <ul>
      {items.map((l)=>{
        return(
          <li key={l.id}>
            {l.product} {l.done}
        </li>
        )
      })}
    </ul>
    )
  }

  return(
    <div>
      <h1>Items.jsx</h1>
      {items && renderItems()}
      <input type="text" value={phrase} onChange={search}/>
      <button>Add</button>
      {found && renderFound()}
      <a href={cfg.authqry}>re-register</a>
    </div>
  )
}


export{Items}