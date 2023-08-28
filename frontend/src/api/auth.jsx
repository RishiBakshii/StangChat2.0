import { INTERNAL_SERVER_ERROR_MESSAGE, SERVER_DOWN_MESSAGE } from "../envVariables"
import { BASE_URL } from "../screens/Home"
import { useNavigate } from "react-router-dom"


export const signup=async(credentials)=>{
    try {
        const response=await fetch(`${BASE_URL}/signup`,{
        method:"POST",
        headers:{
            "Content-Type":'application/json'
        },
        body:JSON.stringify({
            "username":credentials.username,
            "email":credentials.email,
            "password":credentials.password, 
            "location":credentials.location
        })
    })
    const json=await response.json()
    
    if(response.ok){
        return {
            success:true,
            message:json.message,
            userid:json.userid
        }
    }
    if(response.status==400){
        return {
            success: false,
            message: json.message,
        };
    }
    if(response.status==500){
        console.log(json.message)
        return {
            success: false,
            message: INTERNAL_SERVER_ERROR_MESSAGE,
        };
    }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: SERVER_DOWN_MESSAGE,
        };
    }
    

}
export const login=async(credentials)=>{
    try {
        const response=await fetch(`${BASE_URL}/login`,{
        credentials:"include",
        method:"POST",
        headers:{
            "Content-Type":'application/json'
        },
        
        body:JSON.stringify({
            "email":credentials.email,
            "password":credentials.password
        })
        })

        const json=await response.json()

        if(response.ok){
            localStorage.setItem("loggedIn",true)
            return {
                success:true,
                message:json.message,
                userdata:json.userdata,
            }
        }
        if(response.status==400){
            return {
                success:false,
                message:json.message
            }
        }
        if(response.status==500){
            console.log(json.message)
            return {
                success:false,
                message:INTERNAL_SERVER_ERROR_MESSAGE
            }
        }
    } catch (error) {
        console.log(error)
        return {
            success:false,
            message:SERVER_DOWN_MESSAGE
        }
    }
}
export const logoutUser=async()=>{
    try {
        const response=await fetch(`${BASE_URL}/logout`,{
            method:"POST",
            credentials:"include"
        })

        const json=await response.json()

        if (response.ok){
            localStorage.clear()
            return true
        }
        if(response.status==500){
            console.log(json.message)
            alert(INTERNAL_SERVER_ERROR_MESSAGE)
        }


    } catch (error) {
        console.log("error")
        alert(SERVER_DOWN_MESSAGE)
    }
}