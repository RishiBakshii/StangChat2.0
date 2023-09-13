import { BASE_URL } from "../screens/Home"
import { DEFAULT_PROFILE_PATH, INTERNAL_SERVER_ERROR_MESSAGE, S3_BUCKET_NAME, SERVER_DOWN_MESSAGE } from "../envVariables"
import { LogoutUser } from "./auth"
import { handleApiResponse } from "../utils/common"
import AWS from 'aws-sdk'

// ✅ 401 handled
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
          return{
            success:true,
            data:userinfo
          }
        }
        if(response.status===401){
          LogoutUser()
          return{
            success:false,
            message:json.message,
            logout:true
          }
        }

        if(response.status===500){
          console.log(json)
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
// 401 handled ✅
export const get_user_info=async(userid)=>{
  try{
      const response=await fetch(`${BASE_URL}/get_user_info`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      credentials:"include",
      body:JSON.stringify({
        "userID":userid
      })
    })

    const json=await response.json()

    if(response.ok){
      return {
        success:true,
        data:json.data
      }
    }

    if(response.status===404){
      return{
        success:false,
        message:json.message
      }
    }

    if(response.status===401){
      LogoutUser()
      return {
          success:false,
          message:json.message,
          logout:true
      }
    }

    if(response.status===500){
      console.log(json.message)
      return {
        success:false,
        message:INTERNAL_SERVER_ERROR_MESSAGE
      }
    }
    }
    catch(error){
      console.log(error)
      return {
        success:false,
        message:SERVER_DOWN_MESSAGE
      }
    }
}

// 401 handled ✅
export const fetchUserProfile=async(username,loggedInUserId)=>{
    try {
      const response=await fetch(`${BASE_URL}/profile/${username}`,{
        method:"POST",
        credentials:"include",
        headers:{
          'Content-Type':"application/json"
        },
        body:JSON.stringify({
          'userid':loggedInUserId
        })
      })
      const result=await handleApiResponse(response)
      if (result.success){
        const postData=await fetchUserPost(result.data._id.$oid)
        return {
          'profileData':result.data,
          'postData':postData
        }
      }
      else{
        return result
      }
    } catch (error) {
      console.log(error)
      return {
        success:false,
        message:INTERNAL_SERVER_ERROR_MESSAGE
      }
    }
}
  
export const updateProfile=async(credentials,selectedImage,originalFilename)=>{
    try {        
        const s3=new AWS.S3();
        console.log(credentials)
        console.log('selected image',selectedImage)

        let PROFILE_PATH=null

        if(selectedImage!=='not'){

          PROFILE_PATH=`${credentials.user_id}/profile/${originalFilename}`
          const params={
              Bucket:S3_BUCKET_NAME,
              Key:PROFILE_PATH,
              Body:selectedImage
            }
          const uploadResult = await s3.upload(params).promise()
          alert(uploadResult.Location)
        }
        else{
          PROFILE_PATH='default-profile-picture/defaultProfile.png'
          console.log(PROFILE_PATH)
        }
        
        const response=await fetch(`${BASE_URL}/updateprofile`,{
            method:"POST",
            headers:{
              'Content-Type':"application/json"
            },
            body:JSON.stringify({
              'userid':credentials.user_id,
              'bio':credentials.bio,
              'profilePath':PROFILE_PATH
            })
        })  
  
        const json=await response.json()
        
        if(response.ok){
          return {
            success:true,
            message:json.message
          }
        }
        else if(response.status===404){
            return{
              success:false,
              message:json.message
            }
        }
        else if(response.status===500){
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

// 401 handled✅
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

    const result=await handleApiResponse(response)
    if(result.success){
      return result.data
    }
    else{
      return result
    }
  } catch (error) {
    console.log(error)
    return {
      success:false,
      message:SERVER_DOWN_MESSAGE
    }
  }
}

