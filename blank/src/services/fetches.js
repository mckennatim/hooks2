import axios from 'axios';
import {cfg} from '../utilities/getCfg'

const fetchLists = async (token) => {
  const url = `${cfg.url.api}/reg/lists`
  console.log('url: ', url)
  const result = await axios.get(url,{
    headers: {'Authorization': 'Bearer '+ token}
  });
  return result.data;
};

export{fetchLists}