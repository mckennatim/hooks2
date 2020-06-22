import React from 'react'
import {responsivePage} from '../showRWD'

const App = (props)=>{

  const showPage=()=>{
    return responsivePage(props)
  }

  const makeStyles =()=>{
    const dstyles ={
      header:{
        backgroundColor: '#2060AD',
        height: '35px',
        fontSize: '1.3em',
        padding: '15px 25px 1px 25px '
      },
      container:{
        display: 'grid',
        alignItems: 'top',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))'    
      }
    }
    return dstyles
  }
  const styles =makeStyles()

  return(
    <div>
      <header style={styles.header}>stuff2get</header>
      <div style={styles.container}>
        {showPage().map((el,i)=>{
          return <div key={i}>{el}</div>
        })}
      </div>
    </div>
  )
}

export {App}

