import { LogoutUser } from "../api/auth";
import { BASE_URL, INTERNAL_SERVER_ERROR_MESSAGE } from "../envVariables";

export const ImageSelector = (event) => {
    const imageFile = event.target.files[0];
    if (imageFile) {
        const filename=imageFile.name
        return {
            'selectedImage':imageFile,
            'displayImage':URL.createObjectURL(imageFile),
            'filename':filename
        }
    }
  };

export const handleApiResponse=async(response)=>{
    const json = await response.json();

    if (response.ok) {
      return {success:true,data:json};
    }
  
    if(response.status===400){
        return {success:false,message:json.message}
    }
    if (response.status === 401) {
      LogoutUser();
      return { success: false, message: json.message, logout: true };
    }

    if(response.status===404){
        return {success:false,message:json.message}
    }

    if (response.status === 500) {
      console.log(json.message);
      return { success: false, message: INTERNAL_SERVER_ERROR_MESSAGE };
    }
  }

export const send_push_notification=async(fcmToken,title,body)=>{
  try {
    const response=await fetch(`${BASE_URL}/send-notification`,{
      method:"POST",
      headers:{
        'Content-Type':"application/json"
      },
      credentials:"include",
      body:JSON.stringify({
        'fcmToken':fcmToken,
        'title':title,
        'body':body
      })
    })
  } catch (error) {
    console.log(error)
  }
}

export const generateSecureFilename=(filename)=>{
  return filename.replace(/[^a-zA-Z0-9-_\.]/g, '').toLowerCase()
}