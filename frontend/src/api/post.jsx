import { BASE_URL } from "../screens/Home";


export const handlePostUpload=async(userid,caption,selectedImage)=>{
    try {
      const formData=new FormData();
      formData.append("userid",userid);
      formData.append('caption',caption);
      formData.append("post",selectedImage); 

      const response=await fetch(`${BASE_URL}/uploadpost`,{
        method:"POST",
        body:formData,
      })
      const json=await response.json()

      if(response.ok){
        return json
      }
      if(response.status==400){
        alert("some bad request")
      }
      if(response.status==500){
        console.log(response)
        alert("internal server error")
      }

    } catch (error) {
        alert(error)
    }
  }


export const getPostLikes=async(postid)=>{
    try {
      const response=await fetch(`${BASE_URL}/getpostlikes`,{
        method:"POST",
        headers:{
          'Content-Type':"application/json"
        },
        body:JSON.stringify({
          postid:postid
        })
      })

      const json=await response.json()
      if(response.ok){
        console.log(json.message)
        return json.message
      }
      if(response.status==400){
        alert(json.message)
      }
      if(response.status==500){
        alert(json.message)
      }

    } catch (error) {
      console.log(error)
    }
  }