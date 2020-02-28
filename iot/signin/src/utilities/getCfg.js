// import jsenv from '../../envmy.json'
import env from '../../denv.json'
import {storageLocal} from './storageLocal'

const getTLD = (host) =>{
  const sparr = host.split('.')
  console.log('sparr: ', sparr, host)
  if(sparr.length==3) return `${sparr[1]}.${sparr[2]}`//skip subdomain
  else if(sparr.length==4) return 'localhost' //192.168.1.35
  else return 'localhost'
}

const tld = getTLD(window.location.hostname)

const getURLS =(tld)=>{
  const urls = env[tld]
  const hostname= window.location.hostname
  if (hostname.split('.').length==4) {
    const keys= Object.keys(urls)
    keys.map((k)=>{
      const str =  urls[k]
      const nstr=str.replace('localhost', hostname)  
      urls[k] = nstr
    })
  }
  return urls
}
const urls = getURLS(tld)

const authqry = urls.soauth+"/spa/"+env.appid+"?apiURL="+encodeURIComponent(urls.api)+"&cbPath="+encodeURIComponent(env.cbPath)

const signupqry = urls.soauth+"/spa/signup?apiURL="+encodeURIComponent(urls.api)+"&cbPath="+encodeURIComponent(env.cbPath)

const cfg={authqry, appid:env.appid, signupqry, urls, cbPath:env.cbPath}

// const ls = storageLocal(cfg.appid)

// const cfg= env[jsenv.m||'local']

// const authqry = cfg.url.soauth+"/spa/"+cfg.appid+"?apiURL="+encodeURIComponent(cfg.url.api)+"&cbPath="+encodeURIComponent(cfg.cbPath)

// const signupqry = cfg.url.soauth+"/spa/signup?apiURL="+encodeURIComponent(cfg.url.api)+"&cbPath="+encodeURIComponent(cfg.cbPath)

// cfg.url.authqry = authqry
// cfg.url.signupqry = signupqry

const ls = storageLocal(cfg.appid)

const makeHref=(host,app,rt)=>{
  let href
  if(host=='iot.sitebuilt.net'||host=='iot.parleyvale.com'){
    href= `../${app}/`
  } else if(host=='hvac.parleyvale.com')  {
    href= `../`
  }else {
    href = `../../${app}/dist/`
  }
  if(rt){
    href+=rt
  }
  return href
}

export{ls, cfg, makeHref}

// {
//   "https":{
//     "superapp": "iot",
//     "appid": "signin",
//     "url": {
//       "soauth": "https://services.sitebuilt.net/soauth",
//       "api": "https://services.sitebuilt.net/iotex/api"
//     },
//     "cbPath": "#locs"
//   },
//   "local": {
//     "superapp": "iot",
//     "appid": "signin",
//     "url": {
//       "soauth": "https://services.sitebuilt.net/soauth",
//       "api": "http://localhost:3332/api"
//     },
//     "cbPath": "#locs"
//   }
// }