import { LogoutUser } from "../api/auth";
import { INTERNAL_SERVER_ERROR_MESSAGE } from "../envVariables";

export const ImageSelector = (event) => {
  alert("hello sirrrr")
    const imageFile = event.target.files[0];
    if (imageFile) {
        
        return {
            'selectedImage':imageFile,
            'displayImage':URL.createObjectURL(imageFile)
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