import axios from 'axios'

const API = axios.create({
    baseURL:import.meta.env.VITE_API_URL,
    withCredentials:true
})

export const register =async (userData)=>{
  const response = await API.post("/api/auth/register",userData);
  return response.data
}

export const login = async (userData)=>{
    const response = await API.post("/api/auth/login",userData)
    return response.data
}
export const logout = async ()=>{
    const response = await API.post("/api/auth/logout")
    return response.data
}
export const whoAmI = async ()=>{
     const response =await API.get("/api/auth/whoami");
    return response.data
}
