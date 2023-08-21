import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { loggedInUserContext } from '../context/user/Usercontext'


export const About = () => {
    const a=useContext(loggedInUserContext)
  return (
    <>
    
    <h1>this is a about component</h1>

    <h1>hello {a.loggedInUser.username}</h1>

    <Link to={'/'}>home</Link><br />

    <button onClick={()=>a.update()}>change user state</button>
    
    
    </>
  )
}
