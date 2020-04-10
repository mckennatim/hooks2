import React from 'react'
// import io from 'socket.io-client';
// import {cfg} from '../utilities/getCfg'
// const socket = io.connect(cfg.urls.socket, {path:'/s2gi/socket.io'});
// const socket = io.connect(cfg.urls.socket);

const IoTest=()=>{
  // // const socket = io.connect('http://localhost:3222');
  // const [lid, setLid] = useState({curr:'doogy', next:'kitty'})
  // const inpref = React.createRef()



  // useEffect(() => {
  //   socket.on('connect', function() {
  //     // Connected, let's sign-up for to receive messages for this room
  //     console.log('on connected: ')
  //     //socket.emit('room', 'Jutebi');
  //   });
  
  //   socket.on('message', (message)=>{
  //     console.log('receiving')
  //     console.log('message: ', message)
  //   })
  //   return () => {
  //     socket.off("SENDING_NEW_TIME");
  //   };
  // }, []);

  // // const changeLid =(e)=>{
  // //   setLid({...lid, next:e.target.value})
  // //   console.log('lid: ', lid)
  // // }
  // const sendMess=()=>{
  //   console.log(': sdddd')
  //   socket.emit('message', {lid:lid.next, mess:`hi from ${lid.next} cliend}`})
  // }

  // const switchLid=()=>{
  //   console.log('inpref: ', inpref, inpref.current.value)
  //   const bchng = {curr:lid.next, next:inpref.current.value}

  //   setLid(bchng)
  //   console.log('lid.next: ', lid.next)
  //   socket.emit('unsubscribe', lid.next);
  //   socket.emit('subscribe', inpref.current.value);
  //   console.log('lid: ', lid)
  // }

  // console.log('rendering again: ')
  return(
    <div>
      <h1>IoTest.jsx</h1>
      {/* {lid.curr} {lid.next}<br/>
      <input id="inpl" type="text" ref={inpref}/>
      <button onClick={switchLid}>switchLid</button>
      <button onClick={sendMess}>sendMess</button> */}
    </div>
  )
}

export{IoTest}