import { postContext } from "./PostContext";

import React, { useState } from 'react'

export const Poststate = ({children}) => {

    const [feed,setFeed]=useState([])


  return (
    <postContext.Provider value={{feed,setFeed}}>
        {children}
    </postContext.Provider>
  )
}
