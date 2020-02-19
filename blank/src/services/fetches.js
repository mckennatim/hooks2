import axios from 'axios';
import {cfg} from '../utilities/getCfg'


const fetchLists = async (token) => {
  const url = `${cfg.urls.api}/s2g/lists`
  const result = await axios.get(url,{
    headers: {'Authorization': 'Bearer '+ token}
  });
  return {result}
};

const fetchItems = async (q) => {
  const url = `${cfg.urls.api}/s2g/items/${q.lid}`
  const result = await axios.get(url,{
    headers: {'Authorization': 'Bearer '+ q.token}
  });
  return {result}
};

const searchItems = async (q) => {
  const url = `${cfg.urls.api}/s2g/item/${q.lid}/${q.qry}`
  const result = await axios.get(url,{
    headers: {'Authorization': 'Bearer '+ q.token}
  });
  return {result}
};


export{fetchLists, fetchItems, searchItems}