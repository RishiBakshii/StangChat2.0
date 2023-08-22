import { BASE_URL } from "../screens/Home"

export const fetchLoggedInUser=async()=>{
    const authToken=localStorage.getItem("authToken")

    try {
        const response=await fetch(`${BASE_URL}/decode_token`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            "authToken":authToken
                })
            })
    
        const json=await response.json()    
    
        if(response.ok){
            try{
                const response2=await fetch(`${BASE_URL}/get_user_info`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    "userID":json.decoded_token.user_id
                        })
                })
                const json2=await response2.json()
                return json2.data
            }
            catch(error){
                alert(error)
            }
    }

    } catch (error) {
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