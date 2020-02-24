import React,{useState} from 'react'
import { SocketIOProvider} from "use-socketio";

const Twitter = () => {
  const [tweets] = useState([]);

  // const { socket, subscribe, unsubscribe } = useSocket("message", newTweet =>
  //   setTweet([newTweet, ...tweets])
  // );

  return tweets.length ? (
    <ul>
      {tweets.map((tweet,i) => (
        <li key={i}>{tweet.text}</li>
      ))}
    </ul>
  ) : (
    <p>Actually waiting for the websocket server...</p>
  );
};

const IoHook = () => (
  <SocketIOProvider url="http://localhost:3222" >
    <Twitter />
  </SocketIOProvider>
);

export {IoHook}