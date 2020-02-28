import React from 'react'

const Clock =(props)=>{
    const{h,m,sz} =props
    const cl=(h, m,sz)=>{
      const pi=Math.PI
      const c = sz/2
      const rh = c*.75
      const rm = c*.9
      const hh=()=>{
        const r = rh
        const ph = m/60
        let hr = h+ph
        let col ='#E8D4A1'
        if (h>12){
          hr= hr-12
          col = '#83D3D2'
        }
        const rad = 2*pi - 2*pi*(hr/12) +pi/2
        const x = (r*Math.cos(rad)+c).toFixed(2)*1
        const y = (-r*Math.sin(rad)+c).toFixed(2)*1
        return {x,y, col}
      }
      const mh =()=>{
        const r  =rm
        const rad = 2*pi - 2*pi*(m/60)+pi/2
        const x = (r*Math.cos(rad)+c).toFixed(2)*1
        const y = (-r*Math.sin(rad)+c).toFixed(2)*1
        return {x,y}  
      }
      return {
        sz,c,hh,mh
      }
    } 
    const c = cl(h,m,sz)
    return(
      <svg height={c.sz} width={c.sz}>
        <circle cx={c.c} cy={c.c} r={c.c} stroke="black" strokeWidth="1" fill={c.hh().col}  />
        Sorry, your browser does not support inline SVG.  
        <line x1={c.c} y1={c.c} x2={c.hh().x} y2={c.hh().y} stroke="blue" strokeWidth="2" />
        <line x1={c.c} y1={c.c} x2={c.mh().x} y2={c.mh().y} stroke="purple" strokeWidth="1" />
      </svg> 
    )
  }

  export{Clock}