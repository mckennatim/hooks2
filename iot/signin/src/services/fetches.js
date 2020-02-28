import axios from 'axios';
import {cfg} from '../utilities/getCfg'

// console.log('getCfg: ', cfg)

const fetchData = async (qry) => {
  const result = await axios(
    'http://hn.algolia.com/api/v1/search?query='+qry,
  );
  return result.data;
};

const fetchLocs = async (token) => {
  const url = `${cfg.urls.api}/reg/locs`
  console.log('url: ', url)
  const result = await axios.get(url,{
    headers: {'Authorization': 'Bearer '+ token}
  });
  return result.data;
};

const fetchLocApps = async (token, locid) => {
  const url = `${cfg.urls.api}/reg/apps/${locid}`
  console.log('url: ', url)
  const result = await axios.get(url,{
    headers: {'Authorization': 'Bearer '+ token}
  });
  return result.data;
};

const fetchToken = async (token, locid, appid, role) => {
  const url = `${cfg.urls.api}/reg/la/${locid}/${appid}/${role}`
  console.log('url: ', url)
  const result = await axios.get(url,{
    headers: {'Authorization': 'Bearer '+ token}
  });
  return result.data;
};

const fetchDevs = async (token, locid) => {
  const url = `${cfg.urls.api}/signin/devs/${locid}`
  console.log('url: ', url)
  const result = await axios.get(url,{
    headers: {'Authorization': 'Bearer '+ token}
  });
  return result.data;
};

const postDevAuth= async (token, data) =>{
  const url = `${cfg.urls.api}/signin/devauth`
  const options = {headers: {'Authorization': 'Bearer '+ token}}
  const result = await axios.post(url,data,options)
  return result.data
}

const fetchDevsSpecs = async (token, locid)=>{
  const url = `${cfg.urls.api}/signin/specs/${locid}`
  const options = {headers: {'Authorization': 'Bearer '+ token}}
  const result = await axios.get(url,options);
  return result.data;
}

const postAppLoc =  async (token, data) =>{
  const url = `${cfg.urls.api}/signin/apploc`
  const options = {headers: {'Authorization': 'Bearer '+ token}}
  const result = await axios.post(url,data,options)
  return result.data
}

export {fetchData, fetchLocs, fetchLocApps, fetchToken, fetchDevs, postDevAuth, fetchDevsSpecs, postAppLoc}