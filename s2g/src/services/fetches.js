import axios from 'axios';
import {cfg} from '../utilities/getCfg'


const fetchLists = async (token) => {
  const url = `${cfg.urls.api}/s2g/lists`
  try {
    const result = await axios.get(url,{
      headers: {'Authorization': 'Bearer '+ token}
    });
    return result.data
  } catch (err) {
    return {err:'Network Error: server maybe down'}
  }
};

const fetchItems = async (q) => {
  const url = `${cfg.urls.api}/s2g/items/${q.lid}`
  try {
    const result = await axios.get(url,{
      headers: {'Authorization': 'Bearer '+ q.token}
    });
    return result.data
  } catch (err) {
    return {err:'Network Error: server maybe down'}
  }
};

const fetchStoreLocs = async (q) => {
  const url = `${cfg.urls.api}/s2g/stores/${q.lid}`
  try {
    const result = await axios.get(url,{
      headers: {'Authorization': 'Bearer '+ q.token}
    });
    return result.data
  } catch (err) {
    return {err:'Network Error: server maybe down'}
  }
};

const searchItems = async (q) => {
  const url = `${cfg.urls.api}/s2g/item/${q.lid}/${q.qry}`
  const result = await axios.get(url,{
    headers: {'Authorization': 'Bearer '+ q.token}
  });
  return {result}
};


export{fetchLists, fetchItems, searchItems, fetchStoreLocs}