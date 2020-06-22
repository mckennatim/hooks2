import React, {useState, useEffect}  from 'react'
import {ls, cfg} from '../utilities/getCfg'
import {parseHash}from '../utilities/wfuncs'
import {fetchItems, searchItems, fetchStoreLocs} from '../services/fetches'
import io from 'socket.io-client';
import {Item} from './Item.jsx'

// var socket = io.connect(cfg.urls.socket,{
//   secure: true,
//   rejectUnauthorized: false,
//   path: '/s2gi/socket.io'
// });
// var socket = io.connect(cfg.urls.socket, {path:'/sockio/socket.io'});
var socket = io.connect(cfg.urls.socket);

console.log('cfg.urls.socket: ', cfg.urls.socket)

const Items=()=>{
  const qry = parseHash(window.location.hash)

  const[phrase,setPhrase]=useState('')
  const[err,setErr]=useState('')
  const[items,setItems]=useState([])
  const[found,setFound]=useState([])
  const[message, setMessage]=useState({})
  const[lidinfo, setLidinfo]=useState({lid:'', type:''})
  const[locs,setLocs]=useState([])
  const[stores, setStores]=useState([])
  const[sortlist, setSortlist]=useState([])
  const[sorter, setSorter]=useState('sort on')

  if(qry.lid.length==0 && qry.rt=='#items'){
    setErr('No list selected, pick one')
    window.location.href = window.location.href.split('#')[0]+'#lists/'
  }

  const parseMessage=(message)=>{
    if(message.product){
      setMessage(message)
    }
  }

  useEffect(() => {
    socket.on('connect', function() {
      console.log('on connected: ')
    });
    socket.on('message', (message)=>{
      console.log('message: ', message)
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
      if(message.done==-1){//if deleted
        const ditems = items.filter((f)=>f.product!=message.product)
        setItems(ditems)
      }else{ //if modified or new
        const idx = items.findIndex((m)=>{
          return m.product.toLowerCase() == message.product.toLowerCase()
        })
        //if notfound then new so push else change
        idx==-1 ? items.push(message): items[idx]=message
        // const mitems = [...items]
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
          setLidinfo(r.lidinfo)
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
  const createSortList=(stores)=>{
    const ustores = stores.reduce((acc,s)=>{
      return acc.includes(s.store) ? acc : [...acc,s.store]
    },[])
    ustores.unshift('alpha')
    setSortlist(ustores)
  }

  const getStoreLocs =()=>{
    if(ls.getItem() && qry.lid.length>0){
      fetchStoreLocs({token:ls.getKey('token'), lid:qry.lid}).then((r)=>{
        if(r.err){
          setErr(r.err)
        }else{
          setLocs(r.locs)
          setStores(r.stores)
          createSortList(r.stores)
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
    // window.scroll(0,250)
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
    setFound([])
    socket.emit('message', f)
    //updateItem(f.id)
  }

  const addNew =()=>{
    const rec ={lid:qry.lid, product:cap1(phrase), done:0}
    setFound([])
    if (rec.toggle) {delete rec.toggle}
    socket.emit('message', rec)
    console.log('rec: ', rec)
    setPhrase('')
  }


  const isChecked = (l,i)=>()=>{
    l.done=1
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

  const tagsChanged=(l)=>{
    socket.emit('message', l)
  }

  const changeSorter=(e)=>{
    const stidx = stores
      .filter((s)=>s.store==e.target.value)
    console.log(stores)
    console.log('stidx: ', stidx)
    setSorter(e.target.value)
    if (e.target.value=='alpha'){
      items.sort((a,b)=>{
        return a.product.toLowerCase() > b.product.toLowerCase() ? 1 :-1
      })
    }else{
      items.sort((a,b)=>{
        console.log('a,b: ', a,b)
        const aa = stidx.findIndex((s)=>s.loc==a.loc)
        const bb = stidx.findIndex((s)=>s.loc==b.loc)
        console.log('aa,bb: ', aa,bb)
        return aa*1 > bb*1 ? 1 :-1
      })
    }
  }

  const refresh =()=>{
    getItems()
  }

  const renderFound=()=>{
    return(
      <ul>
        {found.map((f,i)=>{
          return(
            <li style={styles.li} key={i} onClick={selectFound(f)}>
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
          <Item  key={l.product} 
            l={l} i={i} locs={locs}
            isChecked={isChecked} 
            delItem={delItem}
            tagsChanged={tagsChanged}
          />
        )
      })}
    </ul>
    )
  }

  const renderHeader = ()=>{
    const opts = sortlist.map((l,i)=>{
      return (
        <option key={i}value={l}>{l}</option>
      )
    })  
    return(
      <header>
        <span>{lidinfo.type} </span>
        <button onClick={refresh}>refresh</button>
        <span> {lidinfo.lid} frog</span>
        <select
          value={sorter}
          name="sorter drop"
          onChange={changeSorter}>
          {opts}  
        </select>
      </header>
    )
  }

  return(
    <div style={styles.fs}>
      {renderHeader()}
      <fieldset>
        <legend>Items</legend>
        <h4>{err.message}</h4>
        <input type="text" value={phrase} onChange={search}/>
        <button onClick={addNew}>Add</button>
        {found && renderFound()}
        {items && renderItems()}
        <a href={cfg.authqry}>re-register</a>
      </fieldset>
    </div>
  )
}


export{Items}

function cap1 (str){
 return str.charAt(0).toUpperCase() +str.slice(1)
}

const styles = {
  fs:{
    backgroundColor: '#00A347'
  },
  li:{
    height:'25px'
  }
}