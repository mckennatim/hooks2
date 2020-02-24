import React, {useState, useEffect}  from 'react'
import {ls, cfg} from '../utilities/getCfg'
import {parseHash}from '../utilities/wfuncs'
import {fetchItems, searchItems} from '../services/fetches'
import io from 'socket.io-client';

const socket = io.connect(cfg.urls.socket);

const Items=()=>{
  const qry = parseHash(window.location.hash)

  const[phrase,setPhrase]=useState('')
  const[err,setErr]=useState('')
  const[items,setItems]=useState([])
  const[found,setFound]=useState([])
  const[message, setMessage]=useState({})


  console.log('qry: ', qry)
  if(qry.lid.length==0 && qry.rt!='#lists'){
    setErr('No list selected, pick one')
    window.location.href = window.location.href.split('#')[0]+'#lists/'
  }

  const parseMessage=(message)=>{
    console.log('message: ', message)
    if(message.product){
      setMessage(message)
    }
  }

  useEffect(() => {
    socket.on('connect', function() {
      console.log('on connected: ')
    });
    socket.on('message', (message)=>{
      parseMessage(message)
    })
    return () => {
      socket.off("socket off");
    };
  }, []);

  useEffect(()=>{
    console.log('items: ', items, Object.keys(message).length)
    if(Object.keys(message).length>0){
      items.push(message)
      setItems(items)
      setMessage({})
    }

  },[message])

  const reregmess = 'This machine does not remember you, try re-registering'

  const getItems=()=>{
    if(ls.getItem() && qry.lid.length>0){
      console.log('getting items: ')
      fetchItems({token:ls.getKey('token'), lid:qry.lid}).then((r)=>{
        console.log('r: ', r)
        if(r.err){
          setErr(r.err)
        }else{
          socket.emit('switch2room', qry.lid)
          setItems(r.items)
          setErr('')
        }
      }) 
    }else if(qry.lid.length==0){
      setErr('no list selected, pick one')
      window.location.href = window.location.href.split('#')[0]+'#lists/'
    }else{
      setErr('NO TOKEN: '+reregmess)
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
    console.log('f: ', f)
    // console.log('items.push(): ', items.push(f))
    // setItems(items)
    setFound([])
    socket.emit('message', f)
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
          <li key={l.product}>
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
      <h4>{err}</h4>
      {items && renderItems()}
      <input type="text" value={phrase} onChange={search}/>
      <button>Add</button>
      {found && renderFound()}
      <a href={cfg.authqry}>re-register</a>
    </div>
  )
}


export{Items}