import { useEffect, useState } from "react";
import  * as authApi from '../api/authApi.js'
import { createContext } from "react";
import { useContext } from "react";



const AuthContext = createContext()

export const AuthProvider = ({children})=>{


    
    const [user,setUser] = useState(null);
    const [loading,setLoading] =useState(false);
    const [checkingAuth,setCheckingAuth] =useState(true);
    const [error,setError] = useState(null);
    const register = async (userData) => {
        try {
            setLoading(true);  
            setError(null);
            const data =  await authApi.register(userData)
            console.log(data)
            setUser(data.user)
            return data.user;              
        } catch (error) {
            setError(error.response?.data?.message || "Registration Failed")
            throw error; 
        } finally{
            setLoading(false)
        }
    }


    const login = async (userData)=>{
  
        try {
            setLoading(true);
            setError(null);
            const data= await authApi.login(userData)
            setUser(data.user);
            return data;
        } catch (error) {
          setError(error.response?.data?.message || "Registration Failed")
            throw error; 
        } finally{
            setLoading(false)
        }


    }
    
    const logout =async ()=>{
        try {
            await authApi.logout();
            setUser(null);
        } catch (error) {
            console.log(error);
        }
    }

const checkAuth = async () => {
    try {
        setCheckingAuth(true);
        const data = await authApi.whoAmI();
        setUser(data.user);
    } catch {
        setUser(null);
    } finally {
        setCheckingAuth(false);
    }
};

    
 const value = {
    user,
    loading,
    checkingAuth,
    error,
    register,
    login,
    logout,
    checkAuth,
    setUser
};
useEffect(() => {
    checkAuth();
}, []); 

      return (
        <AuthContext.Provider value={value}>
         {children}
        </AuthContext.Provider>
   )   


}     

export const useAuth = ()=>{
    return useContext(AuthContext)
}                     
