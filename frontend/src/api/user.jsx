import { BASE_URL } from "../screens/Home"
import { INTERNAL_SERVER_ERROR_MESSAGE, SERVER_DOWN_MESSAGE } from "../envVariables"

export const fetchLoggedInUser=async()=>{
    try {
        const response=await fetch(`${BASE_URL}/decode_token`,{
        method:"POST",
        headers:{
          'Content-Type':"application/json"
        },
        credentials: 'include'
      })
    
        const json=await response.json() 

        if(response.ok){
          const userinfo=await get_user_info(json.decoded_token.user_id)
          return userinfo
    }
    } catch (error) {
        alert('frontend error')
    }  
}

export const get_user_info=async(userid)=>{
  try{
    const response=await fetch(`${BASE_URL}/get_user_info`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        "userID":userid
      })
      })
      const json=await response.json()
      return json.data
    }
    catch(error){
      alert(error)
    }
}

export const fetchUserProfile=async(username,userid)=>{
    try {
      const response=await fetch(`${BASE_URL}/profile/${username}`,{
        method:"POST",
        headers:{
          'Content-Type':"application/json"
        },
        body:JSON.stringify({
          'userid':userid
        })
      })
      const json=await response.json()
      if (response.ok){
        const postData=await fetchUserPost(username=json._id.$oid)
        return {
          'profileData':json,
          'postData':postData
        }
      }
      if(response.status==400){
        alert("status 400")
      }
      if (response.status==500){
        alert("internal server error")
      }
    } catch (error) {
      alert('frontend error')
    }
  }
  
export const updateProfile=async(credentials,selectedImage)=>{
    try {
        const formData=new FormData();
        formData.append("userid", credentials.user_id);
        formData.append("bio", credentials.bio);
        formData.append("profilepicture", selectedImage); 
        formData.append("location", credentials.location); 
        formData.append("username", credentials.username); 
  
        const response=await fetch(`${BASE_URL}/updateprofile`,{
            method:"POST",
            body:formData,
        })  
  
        const json=await response.json()
        
        if(response.ok){
          return {
            success:true,
            message:json.message
          }
        }
        if(response.status==404){
            return{
              success:false,
              message:json.message
            }
        }
        if(response.status==500){
          console.log(json.message)
          return{
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
 
const fetchUserPost=async(userid)=>{
  try {
    const response=await fetch(`${BASE_URL}/getuserpost`,{
      method:"POST",
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        "userid":userid
      })
    })
    const json=await response.json()
    if(response.ok){
      console.log(json)
      return json
    }
    if(response.status==500){
      alert("internal server error")
    }
    if(response.status==400){
      alert("user not found")
    }
  } catch (error) {
    alert("frontend error")
    console.log(error)
  }
}

