import env from '../../denv.json'
import {storageLocal} from './storageLocal'

const getTLD = (host) =>{
  const sparr = host.split('.')
  return sparr.length>2 ? `${sparr[1]}.${sparr[2]}` : host
}

const tld = getTLD(window.location.hostname)
const urls = env[tld]

const authqry = urls.soauth+"/spa/"+env.appid+"?apiURL="+encodeURIComponent(urls.api)+"&cbPath="+encodeURIComponent(env.cbPath)

const signupqry = urls.soauth+"/spa/signup?apiURL="+encodeURIComponent(urls.api)+"&cbPath="+encodeURIComponent(env.cbPath)

const cfg={authqry,appid:env.appid,signupqry, urls, cbPath:env.cbPath}

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
