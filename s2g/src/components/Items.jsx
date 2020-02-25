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
  if(qry.lid.length==0 && qry.rt=='#items'){
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
      const idx = items.findIndex((m)=>{
        console.log('inside indecOF')
        console.log(m.product, message.product)
        console.log(m.product.toLowerCase(), message.product.toLowerCase(),m.product.toLowerCase() == message.product.toLowerCase())
        return m.product.toLowerCase() == message.product.toLowerCase()})
      console.log('idx: ', idx)
      idx==-1 ? items.push(message): items[idx]=message
      console.log('items: ', items)
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
    window.scroll(0,250)
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

  const addNew =()=>{
    const rec ={lid:qry.lid, product:cap1(phrase), done:0, jsod:{}}
    setFound([])
    socket.emit('message', rec)
    console.log('rec: ', rec)
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
      <button onClick={addNew}>Add</button>
      {found && renderFound()}
      <a href={cfg.authqry}>re-register</a>
    </div>
  )
}


export{Items}

function cap1 (str){
 return str.charAt(0).toUpperCase() +str.slice(1)
}