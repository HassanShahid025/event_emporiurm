import React from 'react'
import style from './notFound.module.scss'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className={style["not-found"]}>
        <div>
            <h2>404</h2>
            <p>Page not found</p>
            <button className='--btn'>
                <Link to='/'>&larr;Back To Home</Link>
            </button>
        </div>
    </div>
  )
}

export default NotFound