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

const ls = storageLocal(cfg.appid)
 
const makeHref=(host,app,rt)=>{
  let href
  if(host=='iot.sitebuilt.net'||host=='iot.parleyvale.com'||host=='hvac.parleyvale.com'){
    href= `../${app}/`
  }else {
    href = `../../${app}/dist/`
  }
  if(rt){
    href+=rt
  }
  return href
}

export{ls, cfg, makeHref}
