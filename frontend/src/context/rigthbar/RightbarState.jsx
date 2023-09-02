import { rightBarContext } from './RightbarContext'
import React, { useState } from 'react'

export const RightBarState= ({children}) => {

    const [rightBarOpen,setRightBarOpen]=useState(false)


  return (
    <rightBarContext.Provider value={{rightBarOpen,setRightBarOpen}}>
        {children}
    </rightBarContext.Provider>
  )
}
