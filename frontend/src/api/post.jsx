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
        // updateFeed(json)
        // setCaption("")
        // setDisplayImage(null)
        // onClose()
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