// eslint-disable-next-line no-undef

var cfg=env.pv

console.log(cfg)

// eslint-disable-next-line no-undef
var client = new Paho.MQTT.Client(cfg.url.mqtt_server, cfg.url.mqtt_port, cfg.appid+Math.random());
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

var userEmail=''
var userToken=''
/*ws version*/
function connect() {
  client.connect({
    onSuccess: onConnect,
    useSSL: cfg.ssl,
    onFailure: function (message) {
      console.log("Connection failed: " + message.errorMessage);
      dmessage.innerHTML= "Connection failed: " + message.errorMessage;
    },
    userName: userEmail,
    password: userToken
  });
}

connect()

function onConnect() {
  var lmess = 'Connected to '+cfg.url.mqtt_server
  console.log(lmess);
  dmessage.innerHTML=lmess
  subscribe()
  publish('presence', 'Web Client is alive.. Test Ping! ');
  publish(req, '{"id":2,"req":"flags"}')
  publish(req, '{"id":0,"req":"srstates"}')
  publish(req, '{"id":1,"req":"progs"}')
  publish(req, '{"id":3,"req":"timr"}')
}

function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log('Connection Lost ' + responseObject.errorMessage);
  }
}

function onMessageArrived(message) {
  var topic = message.destinationName
  var pls = message.payloadString
  console.log(topic, pls)
}

// var userEmail=''
// var userToken=''
// var mess
// var dmessage
// var tmr, progs, cmd, prg, set, req, trigtime, devtime, sched;
// var dev,deviceIdv1,m1,v2,m2,v3,m3,wt,onof,srid,srarr,prid,prarr,dreq,dday,dsenrel1,ddayprog,crement


// window.onload=function(){
//   dmessage = document.getElementById("message")
//   mess = "You need a token (and owner's OK) to access a device. Press Register to get a token "
//   var query = window.location.search
//   console.log("query length= ",query.length)
//   dmessage.innerHTML="doggy"

//   if(query.length>1){
//     var qobj = parseQuery(query)
//     console.log(qobj)
//     if(get('qobj.token',qobj)){
//       localStorage.setItem(cfg.appid, JSON.stringify(qobj))
//     }else{
//       mess = decodeURIComponent(qobj.message)+' or register as a different user'
//       console.log(mess)
//       dmessage.innerHTML=mess
//       localStorage.removeItem(cfg.appid)
//     }
//   }

//   var emtok = getToken(cfg.appid)

//   if(!get('emtok.token',emtok)){
//     console.log(mess)
//     dmessage.innerHTML=mess
//     alert(mess)
//   } else{
//     userEmail=emtok.email
//     userToken=emtok.token
//   }


//   dev = document.getElementById("idev")
//   deviceId =dev.value
//     //const deviceId ='CYURD002'
//   oflags = {}
//   osrstate = [];
//   oprogs = []
//   otimr = {};
//   v1 = document.getElementById("tbox1")
//   m1 = document.getElementById("mbox1")
//   v2 = document.getElementById("tbox2")
//   m2 = document.getElementById("mbox2")
//   v3 = document.getElementById("tbox3")
//   m3 = document.getElementById("mbox3")
//   wt = document.getElementById("wt")
//   onof = document.getElementById("onoff")
//   srid = document.getElementById("srid")
//   srarr = document.getElementById("srarr")
//   prid = document.getElementById("prid")
//   prarr = document.getElementById("prarr")
//   dreq = document.getElementById("req")
//   dday = document.getElementById("day")
//   dsenrel = document.getElementById("senrel")
//   ddayprog = document.getElementById("dayprog")
//   crement = 10;

//   window.onfocus = ()=>{
//     console.log('focused')
//     connect()
//   }
//   window.onblur= ()=>{
//     console.log('unfocused')
//     try{
//       client.disconnect()
//     }catch(err){
//       console.log(err)
//     }
//   }
// }
// /*SSL version*/
// // function connect() {
// //     client.connect({
// //         onSuccess: onConnect,
// //         useSSL: true,
// //         userName: 'tim@sitebuilt.net',
// //         password: 'freddy'
// //     });
// // }
// function register(){
//   console.log(stripQuery())
//   window.history.pushState("object or string", "Title", "/"+stripQuery() );
//   const url = cfg.url.soauth+"/spa/"+cfg.appid+"?apiURL="+encodeURIComponent(cfg.url.api)+"&cbPath="+encodeURIComponent(cfg.cbPath)
//   console.log(url)
//   window.location=url
// }


// function subscribe() {
//   client.subscribe(devtime, {
//     onFailure: function (message) {
//       tmess = cfg.url.mqtt_server+" subsrciption failed: "
//       dmessage.innerHTML= tmess;
//     }
//   }) 
//   client.subscribe(userInf, {
//     onFailure: function (message) {
//       tmess = cfg.url.mqtt_server+" subsrciption failed: "
//       dmessage.innerHTML= tmess;
//     }
//   }) 
//   client.subscribe(srstate, {
//     onFailure: function (message) {
//       tmess = cfg.url.mqtt_server+" subsrciption failed: "
//       dmessage.innerHTML= tmess;
//     }
//   })
//   client.subscribe(timr, {
//     onFailure: function (message) {
//       tmess = cfg.url.mqtt_server+" subsrciption failed: "
//       dmessage.innerHTML= tmess;
//     }
//   })
//   client.subscribe(sched, {
//     onFailure: function (message) {
//       tmess = cfg.url.mqtt_server+" subsrciption failed: "
//       dmessage.innerHTML= tmess;
//     }
//   })
//   client.subscribe(flags, {
//     onFailure: function (message) {
//       tmess = cfg.url.mqtt_server+" subsrciption failed: "
//       dmessage.innerHTML= tmess;
//     }
//   })
// }





// function devChanged() {
//   try {
//     console.log(client)
//     client.disconnect()
//   } catch (err) {
//     console.log(err)
//   }
//   deviceId = dev.value
//     //publish to device
//   prg = deviceId + '/prg'
//   cmd = deviceId + '/cmd'
//   req = deviceId + '/req'
//     //publish to server
//   user = 	deviceId + '/user'
//   trigtime = deviceId + '/time'
//     //subscribe
//   userInf = 	deviceId + '/userInf'
//   devtime = deviceId + '/devtime'
//   srstate = deviceId + '/srstate'
//   sched = deviceId + '/sched'
//   flags = deviceId + '/flags'
//     //deprecate
//   timr = deviceId + '/timr'
//   set = deviceId + '/set'
//     // progs = deviceId+'/progs'
//   connect()
// }
// function getUserInfo() {
//   var messu = `{"user":"${userEmail}","appId":"${cfg.appid}"}`
//   console.log(user,messu)
//   publish(user, messu)
// }

// function selChanged() {
//   var id = dreq.options[dreq.selectedIndex].value;
//   var txt = dreq.options[dreq.selectedIndex].text;
//   var thecmd = `{\"id\":${id},\"req\":\"${txt}\"}`
//   console.log(thecmd)
//   publish(req, thecmd)
// }

// function publish(topic, payload) {
//   message = new Paho.MQTT.Message(payload);
//   message.destinationName = topic;
//   client.send(message)
// }

// function acmd() {
//   var id = srid.value
//   var str = srarr.value
//   var arr = str.slice(1, -1).split(',').map(function(e) {
//     return parseInt(e)
//   })
//   var thecmd = `{\"id\":${id}`
//   var sl = str.length
//   thecmd += `,\"sra\":${str}}`
//   console.log(cmd)
//   console.log(thecmd);

//   publish(cmd, thecmd)
// }

// function aprg() {
//   var id = prid.value
//   var str = prarr.value
//   var arr = str.slice(1, -1).split(',').map(function(e) {
//     return parseInt(e)
//   })
//   var thecmd = `{\"id\":${id}`
//   var sl = str.length
//   thecmd += `,\"pro\":[${str}]}`
//   console.log(str)
//   console.log(thecmd);
//   console.log(prg)
//   publish(prg, thecmd)
// }

// function trigTimeUpd() {
//   var thecmd = "trigger time upd from server to esp"
//   console.log(thecmd);
//   console.log(trigtime);
//   publish(trigtime, thecmd)
// }
// function resetConfig() {
//   //var thecmd = '{"devid":"CYURD007", "owner":"tim@sitebuilt.net", "pwd":"geniot", "mqtt_server":"10.0.1.102", "mqtt_port":"1883", "sensor_type":""}'
//   var thecmd = '{"devid":"CYURD001", "owner":"tim@sitebuilt.net", "pwd":"geniot", "mqtt_server":"sitebuilt.net", "mqtt_port":"1884", "sensor_type":""}'
//   //var thecmd = '{"devid":"CYURD007", "owner":"tim@sitebuilt.net", "pwd":"freddy", "mqtt_port":"1883"}'//, "mqtt_server":"10.0.1.102", "mqtt_port":"1883", "sensor_type":""}'
//   console.log(thecmd);
//   var cmdd='{"id":2,"req":"flags"}'
//   publish(set, thecmd)
// }

// function newCrement() {
//   console.log("crement changed")
//     //sendSchedule();
// }

// function sendSchedule() {
//   crement = document.getElementById("crement").value
//   console.log(crement)
//   var d = new Date();
//   var strtmin1 = m1.value;
//   var strtmin2 = m2.value;
//   var strtmin3 = m3.value;
//   var d01 = Date.now() + 60000 * strtmin1
//   var d02 = Date.now() + 60000 * strtmin2
//   var d03 = Date.now() + 60000 * strtmin3
//   var d21 = new Date(d01);
//   var d22 = new Date(d02);
//   var d23 = new Date(d03);

//   var setmin1 = v1.value
//   var setmin2 = v2.value
//   var setmin3 = v3.value
//   var d31 = new Date(d01 + 60000 * (setmin1));
//   var d32 = new Date(d02 + 60000 * (setmin2));
//   var d33 = new Date(d03 + 60000 * (setmin3));
//   console.log(d);
//   var hr1 = d21.getHours();
//   var mi1 = d21.getMinutes();
//   var hr2 = d22.getHours();
//   var mi2 = d22.getMinutes();
//   var hr3 = d23.getHours();
//   var mi3 = d23.getMinutes();
//   var hr31 = d31.getHours();
//   var mi31 = d31.getMinutes();
//   var hr32 = d32.getHours();
//   var mi32 = d32.getMinutes();
//   var hr33 = d33.getHours();
//   var mi33 = d33.getMinutes();
//   console.log(`${d21} - ${hr1}:${mi1}`)
//   console.log(`${d22} - ${hr2}:${mi2}`)
//   console.log(`${d31} - ${hr31}:${mi31}`)
//   console.log(`${d32} - ${hr32}:${mi32}`)
//   var thecmd0 = "{\"id\":0,\"pro\":[[0,0,84,82],[6,30,80,79],[" + hr1 + "," + mi1 + ",78,74],[" + hr31 + "," + mi31 + ",76,73]]}"
//   var thecmd1 = `{\"id\":1,\"pro\":[[0,0,79,76],[6,30,78,75]]}`
//   var thecmd2 = "{\"id\":2,\"pro\":[[0,0,0],[" + hr1 + "," + mi1 + ",1],[" + hr31 + "," + mi31 + ",0]]}"
//   var thecmd3 = "{\"id\":3,\"pro\":[[0,0,0],[" + hr2 + "," + mi2 + ",1],[" + hr32 + "," + mi32 + ",0]]}"
//   var thecmd4 = "{\"id\":4,\"pro\":[[0,0,0],[" + hr3 + "," + mi3 + ",1],[" + hr33 + "," + mi33 + ",0]]}"
//   publish(prg, thecmd0)
//   publish(prg, thecmd1)
//   publish(prg, thecmd2)
//   publish(prg, thecmd3)
//   publish(prg, thecmd4)
// }