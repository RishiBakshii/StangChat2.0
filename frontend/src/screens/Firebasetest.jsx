import React, { useEffect, useState } from 'react'
import {getDatabase,ref,set,get,child,onValue} from 'firebase/database'
import { app } from '../firebase'
import { Button } from '@mui/material'


const db=getDatabase(app)

export const Firebasetest = () => {

    const [data,setData]=useState('')
    const [name,setName]=useState('')

    const putData=()=>{
        set(ref(db,'users/rishi'),{
            id:1,
            name:"rishi",
            age:19
        })
    }


    const getData=async()=>{
        const snapShot=await get(child(ref(db),'users/rishi'))
        const value=await snapShot.val()
        console.log(value)
        setData(value.name)
    }

    useEffect(()=>{
           onValue(ref(db,'users/rishi'),(snapshot)=>{
            // alert(snapshot.val().name)
            setName(snapshot.val().name)
    }) 
    },[])


  return (
    <div>
        <h3>firebase test</h3>
        
        <h4>data {data===''?"no data is fetched":data}</h4>


        <h4>name is {name}</h4>

        <Button onClick={putData}>Put Data</Button>
        <Button onClick={getData}>Get Data</Button>

    </div>
  )
}
