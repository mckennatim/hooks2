import React from 'react'
import * as compoi from './components'
// console.log('compoi: ', compoi)

const responsivePage =(state)=>{
  let elArr = []
  // const pageName = 'Splash'
  const {types, browser} = state.responsive
  const {page} =state.cambio
  const pageName = page.name
  const browserTypeIdx = types.indexOf(browser)
  const panesPerType = compoi.panes[browserTypeIdx]
  const pageList = compoi.multi.filter((amul)=>(amul.pri==pageName))
  if(pageList.length==0){ //if there is no multi array for the page
    const singleElement = React.createElement(compoi[pageName], {key:1, cambio:state.cambio, responsive: state.responsive}, null)
    elArr.push(singleElement)
  }else{
    const multiList= pageList[0].mul.filter((mu,i)=>(i+2)==panesPerType)
    if (multiList.length==0){ // if the multilist is empty
      const singleElement = React.createElement(compoi[pageName] , {key:1, cambio:state.cambio, responsive: state.responsive}, null)
      elArr.push(singleElement)
    }else{//use the array matching the panesPerType size and add all its names to the element arrray
      const elList = multiList[0].map((pgStr,i)=>{
        const pg = React.createElement(compoi[pgStr], {key:i, cambio:state.cambio, responsive: state.responsive}, null)
        // const pg = compoi[pgStr](state)
        return pg
      })
      elArr = elList
    }
  }
  // elArr.push(React.createElement(compoi[pageName], {key:1}, null))
  return elArr
}

export {responsivePage}
