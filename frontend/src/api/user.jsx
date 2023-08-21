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