import { BASE_URL } from "../screens/Home";
import { SERVER_DOWN_MESSAGE } from "../envVariables"
import { handleApiResponse } from "../utils/common";


// 401 handled
export const getPostLikes=async(postid)=>{
    try {
      const response=await fetch(`${BASE_URL}/getpostlikes`,{
        method:"POST",
        headers:{
          'Content-Type':"application/json"
        },
        credentials:"include",
        body:JSON.stringify({
          postid:postid
        })
      })

      return await handleApiResponse(response)

    } catch (error) {
      console.log(error)
      return {
        success:false,
        message:SERVER_DOWN_MESSAGE
      }
    }
  }

  // ✅ 401 handled
export const loadPost=async(page,userid)=>{
    try {
        const response=await fetch(`${BASE_URL}/getfeed`,{
            method:"POST",
            credentials:"include",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                'page':page,
                'userid':userid
            })
        })

         return await handleApiResponse(response)

    }   catch (error) {
        console.log(error)
        return {
          success:false,
          message:SERVER_DOWN_MESSAGE
        }
    }
}