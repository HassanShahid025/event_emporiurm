import React from 'react'
import './loader.scss'
import loaderImg from '../../assets/loader.gif'
 
const Loader = () => {
  return (
    <div className='wrapper'>
        <div className="loader">
            <img src={loaderImg} alt="Loading..." />
        </div>
    </div>
  )
}

export default Loader