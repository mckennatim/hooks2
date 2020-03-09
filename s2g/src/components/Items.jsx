import React, {useState, useEffect}  from 'react'
import {ls, cfg} from '../utilities/getCfg'
import {parseHash}from '../utilities/wfuncs'
import {fetchItems, searchItems, fetchStoreLocs} from '../services/fetches'
import io from 'socket.io-client';
import {Item} from './Item.jsx'

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

  const filterItems = ()=>{
    const witems = items.filter((w)=>w.done==0)
    setItems(witems)
  }

  const waitAsec=()=>{
    setTimeout(()=>filterItems(),1000)
  }


  useEffect(()=>{
    if(Object.keys(message).length>0){
      if(message.done==-1){
        const ditems = items.filter((f)=>f.product!=message.product)
        setItems(ditems)
      }else{
        const idx = items.findIndex((m)=>{
          return m.product.toLowerCase() == message.product.toLowerCase()
        })
        //if notfound then new so push else change
        idx==-1 ? items.push(message): items[idx]=message
        console.log('items: ', items)
        setItems(items)
        waitAsec()
      }
      setMessage({})
    }
  },[message])

  const reregmess = 'This machine does not remember you, try re-registering'

  const getItems=()=>{
    if(ls.getItem() && qry.lid.length>0){
      fetchItems({token:ls.getKey('token'), lid:qry.lid}).then((r)=>{
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

  const getStoreLocs =()=>{
    if(ls.getItem() && qry.lid.length>0){
      console.log('getting stores locs: ')
      fetchStoreLocs({token:ls.getKey('token'), lid:qry.lid}).then((r)=>{
        console.log('r: ', r)
        if(r.err){
          setErr(r.err)
        }else{
          setErr('')
        }
      })
    }
  }

  useEffect(()=>{
    getItems()
    getStoreLocs()
  },[qry.lid])


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
    setFound([])
    socket.emit('message', f)
    //updateItem(f.id)
  }

  const addNew =()=>{
    const rec ={lid:qry.lid, product:cap1(phrase), done:0, jsod:'{}'}
    setFound([])
    if (rec.toggle) {delete rec.toggle}
    socket.emit('message', rec)
    console.log('rec: ', rec)
  }

  const isChecked = (l,i)=>()=>{
    l.done=1
    console.log('i,l: ', i,l)
    const mitems = [...items]
    mitems[i]=l
    setItems(mitems)
    if (l.toggle) {delete l.toggle}
    socket.emit('message', l)
  }

  const delItem=(l)=>()=>{
    l.done = -1
    socket.emit('message', l)
    console.log('DELETING ITEM',l)
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
      {items.map((l,i)=>{
        return(
          <li key={l.product}>
            <Item l={l} i={i} isChecked={isChecked} delItem={delItem}/>
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